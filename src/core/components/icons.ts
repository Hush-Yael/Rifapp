import {
  AiOutlineSun,
  AiFillSun,
  AiOutlineMoon,
  AiFillMoon,
} from "solid-icons/ai";
import { BiRegularBrightnessHalf, BiSolidBrightnessHalf } from "solid-icons/bi";
import type { Theme } from "../lib/theme";
import type { IconTypes } from "solid-icons";
import { FiUpload } from "solid-icons/fi";
import { FaSolidTrashAlt } from "solid-icons/fa";

const Icons = {
  theme: {
    light: {
      fill: AiFillSun,
      outline: AiOutlineSun,
    },
    dark: {
      fill: AiFillMoon,
      outline: AiOutlineMoon,
    },
    system: {
      fill: BiSolidBrightnessHalf,
      outline: BiRegularBrightnessHalf,
    },
  } satisfies Record<Theme, { fill: IconTypes; outline: IconTypes }>,
  upload: FiUpload,
  trash: FaSolidTrashAlt,
} as const;

export default Icons;

export const ThemeIconMatch = (props: {
  option: Theme;
  class?: string;
  current?: boolean;
}) =>
  Icons.theme[props.option][props.current ? "fill" : "outline"]({
    class: props.class,
  });
