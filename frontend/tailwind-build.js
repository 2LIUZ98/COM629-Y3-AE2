import { exec } from 'node:child_process';

exec('npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch', (err, stdout, stderr) => {
  if (err) console.error(err);
  console.log(stdout);
  console.error(stderr);
});