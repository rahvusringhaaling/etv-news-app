<script lang="ts">
  import { onMount } from 'svelte';
  import { current } from '../../../stores/current';
  import { sleep } from '../../../utils';
  import type { IArticleNodes } from '../../../domain/IArticleNodes';
  import { text } from 'stream/consumers';

  let lead = '';
  let body = '';
  let textContainer: HTMLElement;
  let bodyContainer: HTMLElement;
  const maxHeight = 950;
  export let articleNodes: IArticleNodes = {
    usedElements: [],
    availableElements: []
  };

  function getInnermostChild(element: ChildNode): ChildNode {
    return element.hasChildNodes() &&
      element.firstChild?.nodeType !== Node.TEXT_NODE
      ? getInnermostChild(element.firstChild!)
      : element;
  }

  function addBodyChildren() {
    const newChildren = [...bodyContainer.childNodes].map((element) =>
      element.nodeType === Node.TEXT_NODE
        ? document.createElement('br')
        : element
    ) as HTMLElement[];
    articleNodes.availableElements = [...newChildren];
    bodyContainer.replaceChildren();

    for (const candidate of newChildren) {
      bodyContainer.appendChild(candidate);

      const { y } = candidate.getBoundingClientRect();
      if (y > maxHeight) {
        candidate.remove();
        break;
      }

      articleNodes.availableElements.shift();
      articleNodes.usedElements.push(candidate);

      const child = getInnermostChild(candidate);
      if (child.firstChild?.nodeType === Node.TEXT_NODE) {
        const words = child.textContent!.split(' ');
        // console.log(words);
        for (let i = words.length; i >= 0; i--) {
          const { y, height } = candidate.getBoundingClientRect();
          if (y + height <= maxHeight) {
            break;
          }
          child.textContent = words.slice(0, i).join(' ');
        }
      }
    }
  }

  onMount(async () => {
    if (articleNodes.availableElements.length === 0) {
      await sleep(1000);
      lead = $current.article!.lead;
      body = $current.article!.body;
      await sleep(0);
      addBodyChildren();
    }
  });

  export function moveLeft(from: number, to: number) {
    gsap.fromTo(
      textContainer,
      {
        left: from
      },
      {
        left: to,
        duration: 1
      }
    );
  }
</script>

<main>
  <div class="text-container" bind:this={textContainer}>
    <p class="lead">{@html lead}</p>
    <p class="body" bind:this={bodyContainer}>{@html body}</p>
  </div>
</main>

<style>
  .text-container {
    width: 955px;
    height: 905px;
    color: #282828;
    font-family: 'AvenirNextLTPro';
    font-size: 40px;
    padding: 40px 40px 0 95px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .lead :global(p) {
    font-weight: 600;
    padding-bottom: 10px;
  }

  .body :global(*),
  .lead :global(*) {
    white-space: break-spaces;
  }
</style>
