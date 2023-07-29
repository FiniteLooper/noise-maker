const $baseFrequencyX = $('#ctrl-base-frequency-x');
const $baseFrequencyY = $('#ctrl-base-frequency-y');
const $baseFrequencyToggleDisplay = $$('.baseFrequencyToggleDisplay');
const textureStyles = {
  filter: {},
};

//Loop through all the controls and run an event any time one changes
Array.from($$('#svg-controls .form-control-wrapper')).forEach((ctrl) => {
  const $input = ctrl.querySelector(
    'select, input:not([data-enable]):not([data-toggle-visibility])'
  );
  const $enableInput = ctrl.querySelector('input[data-enable]');
  const $toggleVisibilityInput = ctrl.querySelector('input[data-toggle-visibility]');
  const $outputDisplay = ctrl.querySelector('output');

  //Checkboxes to enable/disable other inputs
  if ($enableInput) {
    const $enableTgt = $(attr($enableInput, 'data-enable'));
    $enableInput.addEventListener('input', () => {
      $enableTgt.disabled = !$enableInput.checked;
      updateTexture($enableTgt, $outputDisplay, false);
    });

    //Initialize
    $enableTgt.disabled = !$enableInput.checked;
  }

  if ($toggleVisibilityInput) {
    const $toggleTargets = $$(attr($toggleVisibilityInput, 'data-toggle-visibility'));
    $toggleVisibilityInput.addEventListener('input', () => {
      toggleDisplay($toggleTargets);
    });
  }

  //Form inputs
  if ($input) {
    $input.addEventListener('input', () => {
      updateTexture($input, $outputDisplay, false);
    });

    //Initialize
    updateTexture($input, $outputDisplay, true);
  }
});

/**
 * @description This runs any time an input element changes value
 * @param {HTMLInputElement} $inputEl
 * @param {HTMLOutputElement} $outputDisplay
 */
function updateTexture($inputEl, $outputDisplay, isInit) {
  const isDisabled = $inputEl.disabled;
  const suffix = attr($inputEl, 'data-target-filter-prop-suffix');
  const val = suffix ? $inputEl.value + suffix : $inputEl.value;

  if ($outputDisplay) {
    $outputDisplay.innerHTML = isDisabled ? '' : val;
  }

  if (!isInit && $inputEl.id === 'ctrl-separate-frequencies') {
    separateBaseFrequencies = $inputEl.checked;
    toggleDisplay($baseFrequencyToggleDisplay);
    updateTexture($baseFrequencyX, $outputDisplay);
  } else {
    const tgtSelector = attr($inputEl, 'data-target');
    const tgtStyleProp = attr($inputEl, 'data-target-style-prop');
    const tgtFilterProp = attr($inputEl, 'data-target-filter-prop');
    const tgtAttr = attr($inputEl, 'data-target-attr');
    if (tgtSelector) {
      const $tgt = $(tgtSelector);

      if (tgtStyleProp) {
        $tgt.style[tgtStyleProp] = val;
        textureStyles[tgtStyleProp] = val;
      } else if (tgtFilterProp) {
        updateTextureFilter($tgt, tgtFilterProp, val, isDisabled);
      } else if (tgtAttr) {
        if ($inputEl.id === $baseFrequencyX.id || $inputEl.id === $baseFrequencyY.id) {
          let combinedBaseFreq = $baseFrequencyX.value;
          if (!$baseFrequencyY.disabled) {
            combinedBaseFreq += ` ${$baseFrequencyY.value}`;
          }
          $tgt.attributes[tgtAttr].value = combinedBaseFreq;
        } else {
          $tgt.attributes[tgtAttr].value = val;
        }
      }

      if (attr($inputEl, 'data-force-reload-svg')) {
        forceReloadSvg();
      }
    }
  }
}

function forceReloadSvg() {
  //Re-select every time since it's being replaced and we lose the reference
  const $svg = $('#demo-output svg');

  //remove any styles it has
  if ($svg.attributes.style && $svg.attributes.style.transform) {
    $svg.attributes.style.transform.value = '';
  }

  //clone the element and replace it
  var $clone = $svg.cloneNode(true);
  $svg.parentNode.replaceChild($clone, $svg);

  //force it into a new GPU rendering layer
  $clone.style['transform'] = 'translateZ(0)';
}

function updateTextureFilter($tgt, tgtFilterProp, val, isDisabled) {
  textureStyles.filter[tgtFilterProp] = isDisabled ? null : val;
  $tgt.style.filter = getPropsAsCssString(textureStyles.filter);
}

function getPropsAsCssString(obj) {
  return Object.keys(obj)
    .map((key) => {
      const val = obj[key];
      return val == null ? '' : `${key}(${val})`;
    })
    .filter((v) => v !== '')
    .join(' ');
}

//================================================
// Buttons
//================================================
$('#btn-get-code').addEventListener('click', openDialog);

//All the 'copy' buttons
Array.from($$('.btn-copy')).forEach((btn) => {
  btn.addEventListener('click', () => {
    const tgtSelector = attr(btn, 'data-target');
    if (tgtSelector) {
      navigator.clipboard.writeText($(tgtSelector).value).then(
        () => {},
        () => {
          alert('could not copy text, please select and copy it manually!');
        }
      );
    }
  });
});

//================================================
// Dialog
//================================================
const $modal = $('#code-modal');
const $modalDialog = $modal.querySelector('dialog');
const $ctrlCodeHtml = $('#code-html');
const $ctrlCodeCss = $('#code-css');

$modalDialog.addEventListener('click', function (ev) {
  closeDialog(ev, this);
});

$modalDialog.querySelector('.btn-close').addEventListener('click', function (ev) {
  closeDialog(ev, this);
});

function openDialog() {
  writeCodeToFields();
  toggleDisplay($modal);
  $modalDialog.showModal();
}

function closeDialog(ev, self) {
  if (ev.target == self) {
    $modalDialog.close();
    toggleDisplay($modal);
  }
}

function writeCodeToFields() {
  const $svgFilter = $('#demo-output svg filter');

  const textureStylesStr = Object.keys(textureStyles)
    //skip the mix-blend-mode if it's set to 'normal'
    .filter(
      (k) => k !== 'mix-blend-mode' || (k === 'mix-blend-mode' && textureStyles[k] !== 'normal')
    )
    .map((k) => {
      const val = textureStyles[k];
      if (k === 'filter') {
        const filterValues = getPropsAsCssString(val);
        return `  filter: url(#${$svgFilter.id}) ${filterValues};`;
      }
      return `  ${k}: ${val};`;
    })
    .join('\n');

  $ctrlCodeHtml.value = `<svg xmlns="http://www.w3.org/2000/svg" class="hidden-svg">${prettyIndentHtml(
    $svgFilter.outerHTML
  )}</svg>`;

  $ctrlCodeCss.value = `.bg-texture {
${textureStylesStr}
}
.hidden-svg {
  height: 0px;
  width: 0px;
  overflow: hidden;
  opacity: 0;
  position: absolute;
  z-index: -999;
  left: 0;
  top: 0;
}`;
}

function prettyIndentHtml(htmlStr) {
  const tagLevels = {
    filter: 2,
    feTurbulence: 4,
  };

  Object.keys(tagLevels).forEach((k) => {
    const pattern = new RegExp(`\\s*(<\\/?${k})`, 'ig');
    htmlStr = htmlStr.replace(pattern, `\n${' '.repeat(tagLevels[k])}$1`);
  });

  return `${htmlStr}\n`;
}