import { GoogleGenerativeAI } from '@google/generative-ai';

export interface BlogPost {
  title: string;
  outline: string[];
  content: string;
  metaDescription: string;
  keywords: string[];
}

export class AIBlogEngine {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string, modelName: string = 'gemini-1.5-pro') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async generateBlog(keyword: string): Promise<BlogPost> {
    console.log(`Starting Gemini generation for keyword: ${keyword}`);

    // Step 1: Generate a high-converting, SEO-optimized title
    const title = await this.generateTitle(keyword);
    console.log(`Generated Title: ${title}`);

    // Step 2: Generate a detailed outline
    const outline = await this.generateOutline(title);
    console.log(`Generated Outline.`);

    // Step 3: Write the full content based on the outline
    const content = await this.generateContent(title, outline);
    console.log(`Generated Full Content.`);

    // Step 4: Final SEO Optimization (Meta description & Keywords)
    const { metaDescription, keywords } = await this.optimizeSEO(content);
    console.log(`SEO Optimization Complete.`);

    return {
      title,
      outline,
      content,
      metaDescription,
      keywords,
    };
  }

  private async generateTitle(keyword: string): Promise<string> {
    const prompt = `You are an expert SEO copywriter. Create a high-click-through-rate (CTR), SEO-optimized blog post title for the keyword: "${keyword}". 
    The title should be engaging, professional, and under 60 characters. 
    Return ONLY the title text.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }

  private async generateOutline(title: string): Promise<string[]> {
    const prompt = `You are an expert content strategist. Create a comprehensive, detailed blog post outline for the title: "${title}".
    Include an introduction, at least 3-5 main sections (H2), and sub-points (H3) for each section, and a conclusion.
    Format the response as a numbered list of headings.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.split('\n').filter(line => line.trim() !== '');
  }

  private async generateContent(title: string, outline: string[]): Promise<string> {
    const outlineText = outline.join('\n');
    const prompt = `You are a professional blogger and subject matter expert. Write a high-quality, engaging, and informative blog post based on the following:
    
    Title: ${title}
    Outline:
    ${outlineText}
    
    Guidelines:
    - Use HTML tags for formatting (<h2>, <h3>, <p>, <ul>, <li>, <strong>).
    - Write in a conversational yet authoritative tone.
    - Ensure paragraphs are short for better readability.
    - Include a strong introduction and a clear call-to-action (CTA) in the conclusion.
    - Avoid repetitive AI-typical phrases (e.g., "In the fast-paced world of...", "In conclusion...").
    - Make it feel human-written and deeply researched.
    
    Return the full post in HTML format.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  private async optimizeSEO(content: string): Promise<{ metaDescription: string, keywords: string[] }> {
    const prompt = `Analyze the following blog content and provide:
    1. A compelling meta description (max 160 characters) to improve SEO.
    2. A list of 5-10 relevant long-tail keywords.
    
    Content:
    ${content.substring(0, 10000)} 
    
    Format your response exactly as:
    Meta: [meta description]
    Keywords: [keyword1, keyword2, ...]`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const metaMatch = text.match(/Meta: (.*)/);
    const keywordsMatch = text.match(/Keywords: (.*)/);

    return {
      metaDescription: metaMatch ? metaMatch[1].trim() : '',
      keywords: keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [],
    };
  }
}
