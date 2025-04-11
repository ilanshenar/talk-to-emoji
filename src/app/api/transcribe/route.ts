import { NextResponse } from 'next/server';
import { TranscribeClient, StartTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;
    const language = formData.get('language') as string || 'en-US';
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Generate a unique filename
    const filename = `audio-${Date.now()}.wav`;
    const bucketName = process.env.AWS_S3_BUCKET || 'emoji-transcriptions-career-day';

    // Upload the audio file to S3
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: await audioFile.arrayBuffer(),
      ContentType: 'audio/wav',
    });

    await s3Client.send(putCommand);

    // Start the transcription job with the selected language
    const transcriptionCommand = new StartTranscriptionJobCommand({
      TranscriptionJobName: `transcription-${Date.now()}`,
      LanguageCode: language,
      MediaFormat: 'wav',
      Media: {
        MediaFileUri: `s3://${bucketName}/${filename}`,
      },
      OutputBucketName: bucketName,
      Settings: {
        ShowSpeakerLabels: true,
        MaxSpeakerLabels: 2,
      },
    });

    const transcriptionResponse = await transcribeClient.send(transcriptionCommand);
    
    // Return the job ID to the client
    return NextResponse.json({ 
      jobId: transcriptionResponse.TranscriptionJob?.TranscriptionJobName,
      status: 'processing'
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Failed to start transcription job' }, { status: 500 });
  }
} 