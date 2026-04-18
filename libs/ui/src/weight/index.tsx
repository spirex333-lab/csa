import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../select/index';
export type WeightProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export const Weight = ({ onChange, value, defaultValue }: WeightProps) => (
  <Select
    defaultValue={defaultValue}
    value={value}
    onValueChange={(v) => onChange?.(v)}
  >
    <SelectTrigger className="flex-1">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="extra-thin">Extra Thin</SelectItem>
      <SelectItem value="thin">Thin</SelectItem>
      <SelectItem value="normal">Regular</SelectItem>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="bold">Bold</SelectItem>
    </SelectContent>
  </Select>
);
