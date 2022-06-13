<script lang="ts">
  import { onDestroy } from 'svelte';
  import { current } from '../../../stores/current';
  import { ScheduleType } from '../../../domain/IScheduleItem';
  import { sleep } from '../../../utils';
  import type { IArticleNodes } from '../../../domain/IArticleNodes';

  let lead = '';
  let body = '';
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

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      await sleep(1000);
      lead = item.article!.lead;
      body = item.article!.body;
      await sleep(0);
      addBodyChildren();
    }
  });

  onDestroy(unsubscribe);
</script>

<main>
  <div class="text-container">
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
