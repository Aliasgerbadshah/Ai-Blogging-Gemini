import { genAI } from '@google/genai';

export interface BlogPost {
  title: string;
  outline: string[];
  content: string;
  metaDescription: string;
  keywords: string[];
}

export class AIBlogEngine {
  private client: any;

  constructor(apiKey: string) {
    // Initialize the new Interactions Client
    this.client = new genAI.Client({ apiKey });
  }

  async generateBlog(keyword: string, modelName: string = 'gemini-3.5-flash'): Promise<BlogPost> {
    console.log(`Starting Interactions API generation for keyword: ${keyword} using ${modelName}`);

    // Step 1: Generate Title
    const title = await this.generateText(
      `You are an expert SEO copywriter. Create a high-click-through-rate (CTR), SEO-optimized blog post title for the keyword: "${keyword}". 
      The title should be engaging, professional, and under 60 characters. 
      Return ONLY the title text.`,
      modelName
    );
    console.log(`Generated Title: ${title}`);

    // Step 2: Generate Outline
    const outlineText = await this.generateText(
      `You are an expert content strategist. Create a comprehensive, detailed blog post outline for the title: "${title}".
      Include an introduction, at least 3-5 main sections (H2), and sub-points (H3) for each section, and a conclusion.
      Format the response as a numbered list of headings.`,
      modelName
    );
    const outline = outlineText.split('\n').filter(line => line.trim() !== '');
    console.log(`Generated Outline.`);

    // Step 3: Generate Content
    const content = await this.generateText(
      `You are a professional blogger and subject matter expert. Write a high-quality, engaging, and informative blog post based on the following:
      
      Title: ${title}
      Outline:
      ${outline.join('\n')}
      
      Guidelines:
      - Use HTML tags for formatting (<h2>, <h3>, <p>, <ul>, <li>, <strong>).
      - Write in a conversational yet authoritative tone.
      - Ensure paragraphs are short for better readability.
      - Include a strong introduction and a clear call-to-action (CTA) in the conclusion.
      - Avoid repetitive AI-typical phrases.
      - Make it feel human-written.
      
      Return the full post in HTML format.`,
      modelName
    );
    console.log(`Generated Full Content.`);

    // Step 4: SEO Optimization
    const seoText = await this.generateText(
      `Analyze the following blog content and provide:
      1. A compelling meta description (max 160 characters) to improve SEO.
      2. A list of 5-10 relevant long-tail keywords.
      
      Content:
      ${content.substring(0, 10000)} 
      
      Format your response exactly as:
      Meta: [meta description]
      Keywords: [keyword1, keyword2, ...]`,
      modelName
    );
    
    const metaMatch = seoText.match(/Meta: (.*)/);
    const keywordsMatch = seoText.match(/Keywords: (.*)/);

    return {
      title,
      outline,
      content,
      metaDescription: metaMatch ? metaMatch[1].trim() : '',
      keywords: keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [],
    };
  }

  private async generateText(prompt: string, model: string): Promise<string> {
    const interaction = await this.client.interactions.create({
      model: model,
      input: prompt,
    });
    return interaction.output_text || '';
  }
}
