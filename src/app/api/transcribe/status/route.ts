import { NextResponse } from 'next/server';
import { TranscribeClient, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: 'https://s3.amazonaws.com',
  forcePathStyle: true
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'No job ID provided' }, { status: 400 });
    }

    console.log('Checking status for job:', jobId);
    const command = new GetTranscriptionJobCommand({
      TranscriptionJobName: jobId,
    });

    const response = await transcribeClient.send(command);
    const job = response.TranscriptionJob;
    console.log('Job status:', job?.TranscriptionJobStatus);

    if (job?.TranscriptionJobStatus === 'COMPLETED') {
      // Get the transcript URI from the job output
      const transcriptUri = job.Transcript?.TranscriptFileUri;
      if (!transcriptUri) {
        console.error('No transcript URI found for completed job');
        return NextResponse.json({ 
          status: 'failed',
          error: 'No transcript URI found'
        });
      }

      // Extract bucket and key from the URI
      let bucket, key;
      
      if (transcriptUri.startsWith('s3://')) {
        const match = transcriptUri.match(/^s3:\/\/([^\/]+)\/(.+)$/);
        if (!match) {
          console.error('Invalid S3 URI format:', transcriptUri);
          return NextResponse.json({ 
            status: 'failed',
            error: 'Invalid S3 URI format'
          });
        }
        [, bucket, key] = match;
      } else {
        // Handle https:// format
        const url = new URL(transcriptUri);
        const pathParts = url.pathname.split('/').filter(Boolean);
        bucket = pathParts[0];
        key = pathParts.slice(1).join('/');
      }

      console.log('Fetching transcript from S3:', { bucket, key });
      
      // Get the transcript file from S3
      const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const s3Response = await s3Client.send(getObjectCommand);
      const transcriptContent = await s3Response.Body?.transformToString();
      
      if (!transcriptContent) {
        console.error('No transcript content found in S3 response');
        return NextResponse.json({ 
          status: 'failed',
          error: 'No transcript content found'
        });
      }

      const transcriptData = JSON.parse(transcriptContent);
      const transcript = transcriptData.results.transcripts[0].transcript;
      const languageCode = transcriptData.results.language_code;
      const languageCodes = transcriptData.results.language_codes || [languageCode];

      console.log('Transcription completed, content:', transcript);
      console.log('Detected languages:', languageCodes);

      // Convert transcription to emojis using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an emoji translator. Convert meaningful words in the given text into relevant emojis, but keep common filler words, articles, prepositions, and pronouns as text. Keep words like 'I', 'and', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'he', 'she', 'it', 'they', 'we', 'you', 'me', 'him', 'her', 'them', 'us' as regular text. Only convert nouns, verbs, adjectives, and meaningful words to emojis. The text is in ${languageCodes.join(', ')}. The output should be a mix of text and emojis that maintains readability.`
          },
          {
            role: "user",
            content: transcript
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const emojis = completion.choices[0].message.content;

      return NextResponse.json({
        status: 'completed',
        transcript: transcript,
        emojis: emojis,
        languages: languageCodes,
        jobStatus: job.TranscriptionJobStatus
      });
    } else if (job?.TranscriptionJobStatus === 'FAILED') {
      console.error('Transcription failed:', job.FailureReason);
      return NextResponse.json({
        status: 'failed',
        error: job.FailureReason,
        jobStatus: job.TranscriptionJobStatus
      });
    } else {
      console.log('Job still processing, current status:', job?.TranscriptionJobStatus);
      return NextResponse.json({
        status: job?.TranscriptionJobStatus || 'processing',
        jobStatus: job?.TranscriptionJobStatus
      });
    }
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Failed to check transcription status' }, { status: 500 });
  }
} 