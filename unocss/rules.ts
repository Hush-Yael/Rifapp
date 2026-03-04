import type { Rule, RuleContext } from "unocss";
import type { Config } from "../uno.config";

function fromTheme(
  matchArray: RegExpMatchArray,
  ctx: Readonly<RuleContext<Config>>,
  cssProp: string,
) {
  const [, _color] = matchArray;
  const theme = ctx.theme as Config["theme"];

  const strings = _color.split("-");
  const color = strings[0];
  const specific = strings[1];

  const themeColor = theme!.colors![color] as {
    DEFAULT: string;
    [key: string]: string;
  };

  if (!themeColor) return;

  const c = specific ? themeColor[specific] : themeColor?.DEFAULT;

  if (themeColor)
    return {
      [cssProp]: c,
    };
}

function arbitrary(matchArray: RegExpMatchArray, cssProp: string) {
  const [, match] = matchArray;
  return { [cssProp]: match.replaceAll("_", " ") };
}

const rules: Rule[] = [
  ["aic", { "align-items": "center" }],
  ["jcc", { "justify-content": "center" }],
  ["jb", { "justify-content": "space-between" }],
  ["tac", { "text-align": "center" }],
  ["interpolate-keywords", { "interpolate-size": "allow-keywords" }],
  ["squircle", { "corner-shape": "squircle" }],
  ["text-bottom-to-top", { "writing-mode": "sideways-lr" }],
  [
    /^text-fill-([^\s]+)$/,
    (matches, ctx) => fromTheme(matches, ctx, "-webkit-text-fill-color"),
  ],
  [
    /^text-fill-\[([^\s]*)\]$/,
    (matches) => arbitrary(matches, "-webkit-text-fill-color"),
  ],
  [
    /^webkit-shadow-([^\s]*)$/,
    (matches, ctx) => fromTheme(matches, ctx, "-webkit-box-shadow"),
  ],
  [
    /^webkit-shadow-\[([^\s]*)\]$/,
    (matches) => arbitrary(matches, "-webkit-box-shadow"),
  ],
  [
    /^h-(\d+)dvh$/,
    ([_, d]) => {
      return [
        ["height", `${d}vh`],
        ["height", `${d}dvh`],
      ];
    },
  ],
  [
    /^max-h-(\d+)dvh$/,
    ([_, d]) => {
      return [
        ["max-height", `${d}vh`],
        ["max-height", `${d}dvh`],
      ];
    },
  ],
  [
    /^min-h-(\d+)dvh$/,
    ([_, d]) => {
      return [
        ["min-height", `${d}vh`],
        ["min-height", `${d}dvh`],
      ];
    },
  ],
] satisfies Rule[];

export default rules;
