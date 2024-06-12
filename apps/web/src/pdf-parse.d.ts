declare module 'pdf-parse/lib/pdf-parse.js' {

    import { type PDFData } from 'pdf-parse';

    interface ParseOptions {
        max?: number;
        version?: string;
    }

    interface ParseResult {
        numpages: number;
        numrender: number;
        info: object;
        metadata: object;
        text: string;
        version: string;
    }

    function parse(dataBuffer: PDFData, options?: ParseOptions): Promise<ParseResult>;

    export default parse;
}