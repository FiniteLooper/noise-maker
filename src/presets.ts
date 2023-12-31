import { ctrlIdPrefix, inputEventName } from './main';

export function buildPresetsMenu() {
  const $presetDdl = $('#ddl-preset');
  const presetOptions = presets
    .map((p, i) => {
      let itemContent = '';
      if (Object.hasOwn(p, 'divider')) {
        itemContent = `<li><hr class="dropdown-divider"></li>`;
      } else {
        const preset = p as IPreset;
        itemContent += `<button type="button" class="dropdown-item" data-preset-index="${i}">`;

        if (preset.icon) {
          itemContent += `<i class="bi bi-${preset.icon}"></i> `;
        }

        itemContent += preset.name + '</a>';
      }

      return `<li>${itemContent}</li>`;
    })
    .join('');

  $(presetOptions)
    .on('click', (event: JQuery.ClickEvent) => {
      const presetIndex = $(event.target).data('preset-index');
      applyPreset(presetIndex);
    })
    .appendTo($presetDdl);
}

function applyPreset(num: number): false {
  //dividers can't be selected so we can force the type here
  const selectedPreset = presets[num] as IPreset;
  const arr: IPresetSetting[] = selectedPreset.settings;
  arr.forEach((obj) => {
    if (typeof obj.value === 'boolean') {
      $('#' + ctrlIdPrefix + obj.id)
        .prop('checked', obj.value)
        .trigger(inputEventName);
    } else {
      $('#' + ctrlIdPrefix + obj.id)
        .val(obj.value)
        .trigger(inputEventName);
    }
  });

  return false;
}

export function randomizeSelectOption(ddl: HTMLSelectElement): void {
  const items = ddl.getElementsByTagName('option');
  const index = Math.floor(Math.random() * items.length);
  ddl.selectedIndex = index;
}

export function randomizeRangeOrNumberInput(rangeInput: HTMLInputElement): void {
  //default values defined here: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#validation
  let min = parseFloat(rangeInput.min);
  if (isNaN(min)) min = 0;

  let max = parseFloat(rangeInput.max);
  if (isNaN(max)) max = 100;

  let step = parseFloat(rangeInput.step);
  if (isNaN(step)) step = 1;
  const stepIsWholeNumber = !step.toString().includes('.');

  const randomVal = Math.random() * (max - min) + min;

  rangeInput.value = (stepIsWholeNumber ? Math.round(randomVal) : randomVal).toString();
}

export function randomizeColorValue(colorInput: HTMLInputElement): void {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  colorInput.value = color;
}

const presets: (IPreset | IPresetDivider)[] = [
  {
    name: 'Reset To Default',
    icon: 'arrow-counterclockwise',
    settings: [
      { id: 'base-frequency-x', value: 0.03 },
      { id: 'base-frequency-y', value: 0.03 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 3 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#ffffff' },
      { id: 'lighting-primitive-type', value: 'feDiffuseLighting' },
      { id: 'lighting-surface-scale', value: 3 },
      { id: 'lighting-diffuse-constant', value: 1 },
      { id: 'lighting-specular-exponent', value: 1 },
      { id: 'lighting-specular-constant', value: 1 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 90 },
      { id: 'lighting-distant-elevation', value: 55 },
      { id: 'lighting-point-x', value: 100 },
      { id: 'lighting-point-y', value: 100 },
      { id: 'lighting-point-z', value: 50 },
      { id: 'lighting-spot-overhead-cone-angle', value: 75 },
      { id: 'lighting-spot-overhead-x', value: 180 },
      { id: 'lighting-spot-overhead-y', value: 180 },
      { id: 'lighting-spot-overhead-z', value: 100 },
      { id: 'lighting-spot-manual-cone-angle', value: 45 },
      { id: 'lighting-spot-manual-x', value: 100 },
      { id: 'lighting-spot-manual-y', value: 100 },
      { id: 'lighting-spot-manual-z', value: 50 },
      { id: 'lighting-spot-manual-pointsat-x', value: 150 },
      { id: 'lighting-spot-manual-pointsat-y', value: 150 },
      { id: 'lighting-spot-manual-pointsat-z', value: 50 },
      { id: 'enable-effects', value: false },
      { id: 'blend-mode', value: 'normal' },
      { id: 'effect-saturation', value: 1 },
      { id: 'effect-brightness', value: 1 },
      { id: 'effect-blur', value: 0 },
      { id: 'enable-custom-size', value: false },
      { id: 'custom-width', value: 500 },
      { id: 'custom-height', value: 500 },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#e9e4ef' },
      { id: 'linear-gradient-color1', value: '#e66465' },
      { id: 'linear-gradient-color2', value: '#9198e5' },
      { id: 'linear-gradient-angle', value: 45 },
      { id: 'bg-img-id', value: 106 },
    ],
  },
  { divider: true },
  {
    name: 'Bokeh',
    settings: [
      { id: 'base-frequency-x', value: 0.004 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 1 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 5 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: false },
      { id: 'lighting-diffuse-constant', value: 1 },
      { id: 'lighting-distant-azimuth', value: 45 },
      { id: 'lighting-distant-elevation', value: 60 },
      { id: 'blend-mode', value: 'exclusion' },
      { id: 'enable-effects', value: true },
      { id: 'effect-saturation', value: 5.1 },
      { id: 'effect-brightness', value: 4.1 },
      { id: 'effect-blur', value: 10 },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#ffd9ec' },
    ],
  },
  {
    name: 'Cinder',
    settings: [
      { id: 'base-frequency-x', value: 0.048 },
      { id: 'base-frequency-y', value: 0.059 },
      { id: 'separate-frequencies', value: true },
      { id: 'octaves', value: 3 },
      { id: 'noise-type', value: 'fractalNoise' },
      { id: 'seed', value: 5 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#ff0000' },
      { id: 'lighting-primitive-type', value: 'feSpecularLighting' },
      { id: 'lighting-surface-scale', value: 9 },
      { id: 'lighting-specular-exponent', value: 19.2 },
      { id: 'lighting-specular-constant', value: 2.8 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 45 },
      { id: 'lighting-distant-elevation', value: 60 },
      { id: 'blend-mode', value: 'lighten' },
      { id: 'enable-effects', value: false },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#413a23' },
    ],
  },
  {
    name: 'Color Static',
    settings: [
      { id: 'base-frequency-x', value: 0.367 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 2 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 1 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: false },
      { id: 'lighting-diffuse-constant', value: 1 },
      { id: 'lighting-distant-azimuth', value: 45 },
      { id: 'lighting-distant-elevation', value: 60 },
      { id: 'blend-mode', value: 'lighten' },
      { id: 'enable-effects', value: true },
      { id: 'effect-saturation', value: 8.6 },
      { id: 'effect-brightness', value: 7.8 },
      { id: 'effect-blur', value: 0 },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#000020' },
    ],
  },
  {
    name: 'Film Grain',
    settings: [
      { id: 'base-frequency-x', value: 0.875 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 4 },
      { id: 'noise-type', value: 'fractalNoise' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: false },
      { id: 'lighting-diffuse-constant', value: 1 },
      { id: 'lighting-distant-azimuth', value: 90 },
      { id: 'lighting-distant-elevation', value: 55 },
      { id: 'enable-effects', value: true },
      { id: 'blend-mode', value: 'overlay' },
      { id: 'effect-saturation', value: 0 },
      { id: 'effect-brightness', value: 1 },
      { id: 'effect-blur', value: 0 },
      { id: 'bg-type', value: 'img' },
      { id: 'bg-img-id', value: 65 },
    ],
  },
  {
    name: 'Fudge',
    settings: [
      { id: 'base-frequency-x', value: 0.043 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 4 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#e3d9ca' },
      { id: 'lighting-primitive-type', value: 'feSpecularLighting' },
      { id: 'lighting-surface-scale', value: 10 },
      { id: 'lighting-specular-exponent', value: 5.9 },
      { id: 'lighting-specular-constant', value: 0.9 },
      { id: 'light-type', value: 'point' },
      { id: 'lighting-point-x', value: 227 },
      { id: 'lighting-point-y', value: 163.2 },
      { id: 'lighting-point-z', value: 35.1 },
      { id: 'blend-mode', value: 'normal' },
      { id: 'enable-effects', value: false },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#453e32' },
    ],
  },
  {
    name: 'Infrared',
    settings: [
      { id: 'base-frequency-x', value: 0.001 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 1 },
      { id: 'noise-type', value: 'fractalNoise' },
      { id: 'seed', value: 8 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#d21908' },
      { id: 'lighting-primitive-type', value: 'feDiffuseLighting' },
      { id: 'lighting-surface-scale', value: 0.1 },
      { id: 'lighting-diffuse-constant', value: 0.93 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 1 },
      { id: 'lighting-distant-elevation', value: 31 },
      { id: 'enable-effects', value: true },
      { id: 'blend-mode', value: 'lighten' },
      { id: 'effect-saturation', value: 1 },
      { id: 'effect-brightness', value: 2 },
      { id: 'effect-blur', value: 0 },
      { id: 'bg-type', value: 'img' },
      { id: 'bg-img-id', value: 482 },
    ],
  },
  {
    name: 'Jazz',
    settings: [
      { id: 'base-frequency-x', value: 0.01 },
      { id: 'base-frequency-y', value: 0.02 },
      { id: 'separate-frequencies', value: true },
      { id: 'octaves', value: 1 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 2 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: false },
      { id: 'lighting-diffuse-constant', value: 1 },
      { id: 'lighting-distant-azimuth', value: 45 },
      { id: 'lighting-distant-elevation', value: 60 },
      { id: 'blend-mode', value: 'color-burn' },
      { id: 'enable-effects', value: true },
      { id: 'effect-saturation', value: 4.1 },
      { id: 'effect-brightness', value: 2.7 },
      { id: 'effect-blur', value: 0 },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#f2f3f7' },
    ],
  },
  {
    name: 'Leather',
    settings: [
      { id: 'base-frequency-x', value: 0.231 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 2 },
      { id: 'noise-type', value: 'fractalNoise' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#ded6bc' },
      { id: 'lighting-primitive-type', value: 'feDiffuseLighting' },
      { id: 'lighting-surface-scale', value: 0.4 },
      { id: 'lighting-diffuse-constant', value: 0.7 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 90 },
      { id: 'lighting-distant-elevation', value: 62 },
      { id: 'blend-mode', value: 'normal' },
      { id: 'enable-effects', value: false },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#ffffff' },
    ],
  },
  {
    name: 'Marble/Clouds',
    settings: [
      { id: 'base-frequency-x', value: 0.006 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 3 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 46 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: false },
      { id: 'lighting-diffuse-constant', value: 1 },
      { id: 'lighting-point-x', value: 10 },
      { id: 'lighting-point-y', value: 10 },
      { id: 'lighting-point-z', value: 100 },
      { id: 'enable-effects', value: true },
      { id: 'blend-mode', value: 'normal' },
      { id: 'effect-saturation', value: 0 },
      { id: 'effect-brightness', value: 3.3 },
      { id: 'effect-blur', value: 5.8 },
      { id: 'bg-type', value: 'linear-gradient' },
      { id: 'linear-gradient-color1', value: '#647a9b' },
      { id: 'linear-gradient-color2', value: '#8899a4' },
      { id: 'linear-gradient-angle', value: 296.1 },
    ],
  },
  {
    name: 'Microscopic',
    settings: [
      { id: 'base-frequency-x', value: 0.035 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 1 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 28 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: false },
      { id: 'lighting-diffuse-constant', value: 1 },
      { id: 'lighting-distant-azimuth', value: 45 },
      { id: 'lighting-distant-elevation', value: 60 },
      { id: 'blend-mode', value: 'luminosity' },
      { id: 'enable-effects', value: true },
      { id: 'effect-saturation', value: 1 },
      { id: 'effect-brightness', value: 4.3 },
      { id: 'effect-blur', value: 0 },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#dadedd' },
    ],
  },
  {
    name: 'Paper',
    settings: [
      { id: 'base-frequency-x', value: 0.1 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 3 },
      { id: 'noise-type', value: 'fractalNoise' },
      { id: 'seed', value: 2 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#fbfce9' },
      { id: 'lighting-primitive-type', value: 'feDiffuseLighting' },
      { id: 'lighting-surface-scale', value: 0.3 },
      { id: 'lighting-diffuse-constant', value: 1.08 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 180 },
      { id: 'lighting-distant-elevation', value: 65 },
      { id: 'blend-mode', value: 'normal' },
      { id: 'enable-effects', value: true },
      { id: 'effect-saturation', value: 1 },
      { id: 'effect-brightness', value: 1 },
      { id: 'effect-blur', value: 0 },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#ffffff' },
    ],
  },
  {
    name: 'Reptile',
    settings: [
      { id: 'base-frequency-x', value: 0.001 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 6 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#637e30' },
      { id: 'lighting-primitive-type', value: 'feDiffuseLighting' },
      { id: 'lighting-surface-scale', value: 10 },
      { id: 'lighting-diffuse-constant', value: 1.97 },
      { id: 'light-type', value: 'point' },
      { id: 'lighting-point-x', value: 10 },
      { id: 'lighting-point-y', value: 10 },
      { id: 'lighting-point-z', value: 100 },
      { id: 'blend-mode', value: 'normal' },
      { id: 'enable-effects', value: false },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#ffffff' },
    ],
  },
  {
    name: 'Rocky Sunrise',
    settings: [
      { id: 'base-frequency-x', value: 0.03 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 3 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#939393' },
      { id: 'lighting-primitive-type', value: 'feSpecularLighting' },
      { id: 'lighting-surface-scale', value: 4.6 },
      { id: 'lighting-specular-exponent', value: 7.1 },
      { id: 'lighting-specular-constant', value: 0.7 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 90 },
      { id: 'lighting-distant-elevation', value: 65 },
      { id: 'enable-effects', value: true },
      { id: 'blend-mode', value: 'exclusion' },
      { id: 'effect-saturation', value: 1 },
      { id: 'effect-brightness', value: 1 },
      { id: 'effect-blur', value: 0 },
      { id: 'bg-type', value: 'linear-gradient' },
      { id: 'linear-gradient-color1', value: '#c2c187' },
      { id: 'linear-gradient-color2', value: '#7e93c9' },
      { id: 'linear-gradient-angle', value: 180 },
    ],
  },
  {
    name: 'Solarized Rose',
    settings: [
      { id: 'base-frequency-x', value: 0.032 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 3 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#d96666' },
      { id: 'lighting-primitive-type', value: 'feSpecularLighting' },
      { id: 'lighting-surface-scale', value: 10 },
      { id: 'lighting-specular-exponent', value: 8.4 },
      { id: 'lighting-specular-constant', value: 0.9 },
      { id: 'light-type', value: 'point' },
      { id: 'lighting-point-x', value: 260 },
      { id: 'lighting-point-y', value: 260 },
      { id: 'lighting-point-z', value: 100 },
      { id: 'blend-mode', value: 'normal' },
      { id: 'enable-effects', value: false },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#f5f5f5' },
    ],
  },
  {
    name: 'Sun Spots',
    settings: [
      { id: 'base-frequency-x', value: 0.079 },
      { id: 'base-frequency-y', value: 0.702 },
      { id: 'separate-frequencies', value: true },
      { id: 'octaves', value: 2 },
      { id: 'noise-type', value: 'fractalNoise' },
      { id: 'seed', value: 35 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#cdc51f' },
      { id: 'lighting-primitive-type', value: 'feSpecularLighting' },
      { id: 'lighting-surface-scale', value: 5.4 },
      { id: 'lighting-specular-exponent', value: 11.8 },
      { id: 'lighting-specular-constant', value: 2.2 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 157 },
      { id: 'lighting-distant-elevation', value: 67 },
      { id: 'blend-mode', value: 'screen' },
      { id: 'enable-effects', value: true },
      { id: 'effect-saturation', value: 1 },
      { id: 'effect-brightness', value: 1 },
      { id: 'effect-blur', value: 5.3 },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#bf3304' },
    ],
  },
  {
    name: 'Threads',
    settings: [
      { id: 'base-frequency-x', value: 0.022 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 1 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#ffffff' },
      { id: 'lighting-primitive-type', value: 'feDiffuseLighting' },
      { id: 'lighting-surface-scale', value: 0.7 },
      { id: 'lighting-diffuse-constant', value: 1.09 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 45 },
      { id: 'lighting-distant-elevation', value: 60 },
      { id: 'blend-mode', value: 'normal' },
      { id: 'enable-effects', value: false },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#ffffff' },
    ],
  },
  {
    name: 'Water',
    settings: [
      { id: 'base-frequency-x', value: 0.001 },
      { id: 'base-frequency-y', value: 0.011 },
      { id: 'separate-frequencies', value: true },
      { id: 'octaves', value: 3 },
      { id: 'noise-type', value: 'fractalNoise' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#2492ff' },
      { id: 'lighting-primitive-type', value: 'feSpecularLighting' },
      { id: 'lighting-surface-scale', value: 9.1 },
      { id: 'lighting-specular-exponent', value: 5.6 },
      { id: 'lighting-specular-constant', value: 1.6 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 86 },
      { id: 'lighting-distant-elevation', value: 62 },
      { id: 'blend-mode', value: 'multiply' },
      { id: 'enable-effects', value: false },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#0080c0' },
    ],
  },
  {
    name: 'Watercolor',
    settings: [
      { id: 'base-frequency-x', value: 0.048 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 4 },
      { id: 'noise-type', value: 'fractalNoise' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#b4b4b4' },
      { id: 'lighting-primitive-type', value: 'feDiffuseLighting' },
      { id: 'lighting-surface-scale', value: 2.3 },
      { id: 'lighting-diffuse-constant', value: 0.93 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 133 },
      { id: 'lighting-distant-elevation', value: 60 },
      { id: 'enable-effects', value: true },
      { id: 'blend-mode', value: 'overlay' },
      { id: 'effect-saturation', value: 1 },
      { id: 'effect-brightness', value: 1 },
      { id: 'effect-blur', value: 0 },
      { id: 'bg-type', value: 'img' },
      { id: 'bg-img-id', value: 152 },
    ],
  },
  {
    name: 'Waves',
    settings: [
      { id: 'base-frequency-x', value: 0.043 },
      { id: 'separate-frequencies', value: false },
      { id: 'octaves', value: 3 },
      { id: 'noise-type', value: 'fractalNoise' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#00274f' },
      { id: 'lighting-primitive-type', value: 'feSpecularLighting' },
      { id: 'lighting-surface-scale', value: 10 },
      { id: 'lighting-specular-exponent', value: 7.8 },
      { id: 'lighting-specular-constant', value: 1.9 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 45 },
      { id: 'lighting-distant-elevation', value: 60 },
      { id: 'blend-mode', value: 'normal' },
      { id: 'enable-effects', value: false },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#f5f5f5' },
    ],
  },
  {
    name: 'Wood Grain',
    settings: [
      { id: 'base-frequency-x', value: 0.1 },
      { id: 'base-frequency-y', value: 0.001 },
      { id: 'separate-frequencies', value: true },
      { id: 'octaves', value: 3 },
      { id: 'noise-type', value: 'turbulence' },
      { id: 'seed', value: 0 },
      { id: 'tile-stitch', value: 'stitch' },
      { id: 'enable-lighting', value: true },
      { id: 'lighting-lighting-color', value: '#daa841' },
      { id: 'lighting-primitive-type', value: 'feSpecularLighting' },
      { id: 'lighting-surface-scale', value: 7.7 },
      { id: 'lighting-specular-exponent', value: 35.9 },
      { id: 'lighting-specular-constant', value: 1.3 },
      { id: 'light-type', value: 'distant' },
      { id: 'lighting-distant-azimuth', value: 45 },
      { id: 'lighting-distant-elevation', value: 60 },
      { id: 'blend-mode', value: 'multiply' },
      { id: 'enable-effects', value: true },
      { id: 'effect-saturation', value: 1.6 },
      { id: 'effect-brightness', value: 1 },
      { id: 'effect-blur', value: 1 },
      { id: 'bg-type', value: 'solid-color' },
      { id: 'bg-color', value: '#af994e' },
    ],
  },
];
