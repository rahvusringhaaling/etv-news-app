import { readFile, writeFile } from 'fs/promises';

// Fix for CasparCG error "Terminating renderer for bad IPC message, reason 167"
// https://casparcgforum.org/t/strange-error-terminating-renderer-for-bad-ipc-message-reason-167-for-html-template/4926/7
async function modify() {
  const path = './dist/index.html';
  const data = await readFile(path, { encoding: 'utf8' });

  const regex = /<script type="module" crossorigin src="([^"]*)"><\/script>/;
  const match = data.match(regex)[1];
  const replacement = `
  <script>
    setTimeout(() => {
      const script = document.createElement('script');
      script.type = "module";
      script.src = "${match}";
      document.head.appendChild(script);
    }, 150);
  </script>
  `
  const newData = data.replace(regex, replacement);

  await writeFile(path, newData);
}

modify();
