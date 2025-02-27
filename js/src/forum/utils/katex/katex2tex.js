/*
 * This file is part of MathRen.
 *
 * Original Copyright Khan Academy. Licensed under the MIT License.
 * See license text at https://github.com/KaTeX/KaTeX/blob/master/LICENSE.
 */

// Replace .katex elements with their TeX source (<annotation> element).
// Modifies fragment in-place.  Useful for writing your own 'copy' handler,
// as in copy-tex.js.
export const katexReplaceWithTex = function (fragment, copyDelimiters) {
  // Remove .katex-html blocks that are preceded by .katex-mathml blocks
  // (which will get replaced below).
  const katexHtml = fragment.querySelectorAll('.katex-mathml + .katex-html');

  for (let i = 0; i < katexHtml.length; i++) {
    const element = katexHtml[i];

    if (element.remove) {
      element.remove(null);
    } else {
      element.parentNode.removeChild(element);
    }
  }

  // Replace .katex-mathml elements with their annotation (TeX source)
  // descendant, with inline delimiters.
  const katexMathml = fragment.querySelectorAll('.katex-mathml');

  for (let i = 0; i < katexMathml.length; i++) {
    const element = katexMathml[i];
    const texSource = element.querySelector('annotation');

    if (texSource) {
      if (element.replaceWith) {
        element.replaceWith(texSource);
      } else {
        element.parentNode.replaceChild(texSource, element);
      }

      texSource.innerHTML = copyDelimiters.inline[0] + texSource.innerHTML + copyDelimiters.inline[1];
    }
  }

  // Switch display math to display delimiters.
  const displays = fragment.querySelectorAll('.katex-display annotation');

  for (let i = 0; i < displays.length; i++) {
    const element = displays[i];

    element.innerHTML =
      copyDelimiters.display[0] +
      element.innerHTML.substr(
        copyDelimiters.inline[0].length,
        element.innerHTML.length - copyDelimiters.inline[0].length - copyDelimiters.inline[1].length
      ) +
      copyDelimiters.display[1];
  }

  return fragment;
};

export default katexReplaceWithTex;
