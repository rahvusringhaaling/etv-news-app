<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { gsap } from 'gsap';
  import { Language } from '../../../types/Language';
  import { language } from '../../../stores/language';
  import type { IArticleNodes } from '../../../types/IArticleNodes';
  import type { IArticle } from '../../../types/IArticle';

  let lead = '';
  let body = '';
  let textContainer: HTMLElement;
  let leadContainer: HTMLElement;
  let bodyContainer: HTMLElement;
  const maxHeight = 950;
  export let article: IArticle | undefined;
  export let leadArticleNodes: IArticleNodes = {
    usedElements: [],
    availableElements: [],
  };
  export let bodyArticleNodes: IArticleNodes = {
    usedElements: [],
    availableElements: [],
  };
  export let primaryColor = '';
  export let showMore = false;
  const dispatch = createEventDispatcher();

  function getInnermostChild(element: ChildNode): ChildNode {
    return element.hasChildNodes() &&
      element.firstChild?.nodeType !== Node.TEXT_NODE
      ? getInnermostChild(element.firstChild!)
      : element;
  }

  function createEmpty(articleNodes: IArticleNodes, container: HTMLElement) {
    const newChildren = [...container.childNodes].map((element) =>
      element.nodeType === Node.TEXT_NODE
        ? document.createElement('br')
        : element
    ) as HTMLElement[];
    articleNodes.availableElements = [...newChildren];
    container.innerHTML = '';

    addContainerChildren(newChildren, articleNodes, container);
  }

  function addContainerChildren(
    newChildren: HTMLElement[],
    articleNodes: IArticleNodes,
    container: HTMLElement
  ) {
    for (const [i, candidate] of newChildren.entries()) {
      if (i === 0 && candidate.nodeName === 'BR') {
        articleNodes.availableElements.shift();
        continue;
      }

      const copy = (candidate as any).cloneNode(true);
      container.appendChild(copy);

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

  function trimWhitespaceAtArticleEnd() {
    while (true) {
      const lastChild = bodyContainer.lastElementChild;
      if (lastChild?.tagName === 'BR') {
        bodyContainer.removeChild(lastChild);
      } else if (lastChild?.innerHTML.length === 0) {
        bodyContainer.removeChild(lastChild);
      } else {
        return;
      }
    }
  }

  onMount(async () => {
    if (bodyArticleNodes.availableElements.length === 0) {
      textContainer.style.left = '0';
      lead = article!.lead;
      body = article!.body;
      await tick();
      createEmpty(leadArticleNodes, leadContainer);
      createEmpty(bodyArticleNodes, bodyContainer);
    } else {
      addContainerChildren(
        [...leadArticleNodes.availableElements],
        leadArticleNodes,
        leadContainer
      );
      addContainerChildren(
        [...bodyArticleNodes.availableElements],
        bodyArticleNodes,
        bodyContainer
      );
    }
    trimWhitespaceAtArticleEnd();

    await tick();
    const { height: heightLead } = leadContainer.getBoundingClientRect();
    const { height: heightBody } = bodyContainer.getBoundingClientRect();
    const isTooLong = heightLead + heightBody > 770;
    if (isTooLong) {
      console.warn(
        `Did not fit! ${heightLead} + ${heightBody} = ${
          heightLead + heightBody
        } (limit 770px) \n ${article?.header}`
      );
    }

    const isLast = bodyArticleNodes.availableElements.length === 0;
    dispatch('textrender', { isLast, isTooLong });
  });

  export function getLeadArticleNodes() {
    return leadArticleNodes;
  }

  export function getBodyArticleNodes() {
    return bodyArticleNodes;
  }

  export function moveLeft(from: number, to: number) {
    gsap.fromTo(
      textContainer,
      {
        left: from,
      },
      {
        left: to,
        duration: 0.75,
      }
    );
  }
</script>

<main style="--primary-color: {primaryColor}">
  <div class="text-container" bind:this={textContainer}>
    <span class:mask={showMore}>
      <p class="lead" bind:this={leadContainer}>{@html lead}</p>
      <p class="body" bind:this={bodyContainer}>{@html body}</p>
    </span>
    {#if showMore}
      <div class="more">
        <p>
          {#if $language === Language.Estonian}
            Loe seda uudist edasi portaalist ERR.ee
          {:else}
            Читайте дальше на портале rus.ERR.ee
          {/if}
        </p>
        <svg viewBox="0 0 13 16">
          <path d="M13,8L0,0V16L13,8Z" />
        </svg>
      </div>
    {/if}
  </div>
</main>

<style>
  .text-container {
    width: 955px;
    height: 905px;
    color: #282828;
    font-size: 40px;
    padding: 40px 40px 0 95px;
    position: absolute;
    left: -1000px;
    top: 0;
    display: flex;
    flex-direction: column;
  }

  .text-container > span {
    display: flex;
    flex-direction: column;
  }

  .mask {
    mask-image: linear-gradient(to top, transparent 19%, black 40%);
    -webkit-mask-image: linear-gradient(to top, transparent 19%, black 40%);
  }

  .lead :global(p) {
    font-weight: 600;
    padding-bottom: 30px;
  }

  .body :global(*),
  .lead :global(*) {
    white-space: normal;
  }

  svg {
    width: 14px;
    height: 44px;
  }

  path {
    fill: var(--primary-color);
    fill-rule: evenodd;
  }

  .more {
    display: flex;
    font-size: 37px;
    color: var(--primary-color);
    position: absolute;
    bottom: 118px;
    right: 64px;
  }

  .more > p {
    margin-right: 17px;
  }
</style>
