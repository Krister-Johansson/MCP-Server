import { Context } from '@rekog/mcp-nest';
export declare class GreetingTool {
    constructor();
    sayHello({ name }: {
        name: any;
    }, context: Context): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    getCurrentSchema({ uri, userName }: {
        uri: string;
        userName: string;
    }): Promise<{
        content: {
            uri: string;
            text: string;
            mimeType: string;
        }[];
    }>;
}
