<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { current } from '../../../stores/current';
  import type { IArticleNodes } from '../../../domain/IArticleNodes';

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

  function createEmpty() {
    const newChildren = [...bodyContainer.childNodes].map((element) =>
      element.nodeType === Node.TEXT_NODE
        ? document.createElement('br')
        : element
    ) as HTMLElement[];
    articleNodes.availableElements = [...newChildren];
    bodyContainer.replaceChildren();

    addBodyChildren(newChildren);
  }

  function addBodyChildren(newChildren: HTMLElement[]) {
    for (const [i, candidate] of newChildren.entries()) {
      if (i === 0 && candidate.nodeName === 'BR') {
        articleNodes.availableElements.shift();
        continue;
      }

      const copy = (candidate as any).cloneNode(true);
      bodyContainer.appendChild(copy);

      const { y, height } = copy.getBoundingClientRect();
      if (y > maxHeight) {
        copy.remove();
        break;
      }

      articleNodes.usedElements.push(copy);
      if (y + height <= maxHeight) {
        articleNodes.availableElements.shift();
        continue;
      }

      const child = getInnermostChild(copy);
      if (child.firstChild?.nodeType === Node.TEXT_NODE) {
        const words = child.textContent!.split(' ');
        let sliceIndex = 0;
        for (let i = words.length; i >= 0; i--) {
          const { y, height } = copy.getBoundingClientRect();
          if (y + height <= maxHeight) {
            break;
          }
          child.textContent = words.slice(0, i).join(' ');
          sliceIndex = i;
        }

        if (sliceIndex !== 0) {
          const candidateChild = getInnermostChild(candidate);
          candidateChild.textContent = words.slice(sliceIndex).join(' ');
        }
      }
    }
  }

  onMount(async () => {
    const t = Date.now();
    if (articleNodes.availableElements.length === 0) {
      textContainer.style.left = '0';
      lead = $current.article!.lead;
      body = $current.article!.body;
      await tick();
      createEmpty();
    } else {
      addBodyChildren([...articleNodes.availableElements]);
    }

    await tick();
    console.log('End, took in seconds:', (Date.now() - t) / 1000);
  });

  export function getArticleNodes() {
    return articleNodes;
  }

  export function moveLeft(from: number, to: number) {
    gsap.fromTo(
      textContainer,
      {
        left: from
      },
      {
        left: to,
        duration: 0.75
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
    left: -1000px;
    top: 0;
    display: flex;
    flex-direction: column;
  }

  .lead :global(p) {
    font-weight: 600;
    padding-bottom: 30px;
  }

  .body :global(*),
  .lead :global(*) {
    white-space: break-spaces;
  }
</style>
