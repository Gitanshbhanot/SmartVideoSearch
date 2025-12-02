import {
  BrainIcon,
  Car05Icon,
  GitCompareIcon,
  InvoiceIcon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const chatModes = [
  {
    label: "Reasoning",
    value: "reasoning",
    prompt:
      "Analyze the uploaded media and provide a detailed summary of the content.",
    description: "AI interprets and reasons through data in uploaded media.",
    icon: <HugeiconsIcon icon={BrainIcon} size={"16px"} />,
    hideShortcut: true,
  },
  {
    label: "Number plate",
    value: "npr",
    icon: <HugeiconsIcon icon={Car05Icon} size={"16px"} />,
    prompt: "",
    // prompt: "Identify and extract number plates from uploaded media.",
    description:
      "AI identifies and extracts number plates from uploaded media.",
    hideDropDown: true,
  },
  {
    label: "Invoice",
    value: "invoice",
    icon: <HugeiconsIcon icon={InvoiceIcon} size={"16px"} />,
    prompt: "",
    // prompt: "Extract and analyze data from invoices in uploaded media.",
    description:
      "AI extracts and analyzes data from invoices in uploaded media.",
    hideDropDown: true,
  },
  {
    label: "Compare",
    value: "compare",
    icon: <HugeiconsIcon icon={GitCompareIcon} size={"16px"} />,
    prompt: "",
    // prompt:
    //   "Compare the uploaded media and provide a detailed summary of the content.",
    description: "AI evaluates and contrasts data within uploaded media.",
  },
  {
    label: "Summarise",
    value: "summarise",
    icon: <HugeiconsIcon icon={Task01Icon} size={"16px"} />,
    prompt: "",
    // prompt:
    //   "Summarize the uploaded media and provide a detailed summary of the content.",
    description:
      "AI condenses uploaded media into concise, key-point summaries.",
  },
  {
    label: "Moment retrieval",
    value: "momret",
    icon: <HugeiconsIcon icon={Task01Icon} size={"16px"} />,
    prompt: "",
    description: "AI condenses grabs moments from uploaded media.",
    hideShortcut: true,
  },
];
