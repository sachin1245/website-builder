import fs from 'fs';
import path from 'path';

export const loadTemplates = () => {
  const templatesDir = path.join(process.cwd(), 'public', 'templates');
  const templateFiles = fs.readdirSync(templatesDir);
  
  return templateFiles.map((file) => {
    const content = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
    return JSON.parse(content);
  });
};

export const saveTemplate = (template: any) => {
  const templatesDir = path.join(process.cwd(), 'public', 'templates');
  const fileName = `template_${Date.now()}.json`;
  fs.writeFileSync(path.join(templatesDir, fileName), JSON.stringify(template));
};