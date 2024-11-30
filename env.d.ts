// nodejs.d.ts

declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      DATABASE_URL?: string;
      NEXT_PUBLIC_BASE_URL?: string;
      [key: string]: string | undefined; // Allow additional environment variables
    }
  
    interface Process {
      env: ProcessEnv;
      argv: string[]; // Command-line arguments
      exit(code?: number): void;
      stdout: WritableStream;
      stderr: WritableStream;
      stdin: ReadableStream;
      // Add custom properties as needed
      customProperty?: string;
    }
  
    // Add other custom types if required
    interface Global {
      myGlobalVariable?: string;
    }
  }
  
  declare const process: NodeJS.Process;
  