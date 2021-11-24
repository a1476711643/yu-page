export type ComponentDto = {
  type: { name: string; label: string };
  name: string;
  label: string;
  icon: string;
  commonStyleKeys: string[];
  props: Record<string, any>;
};

export type StyleDto = {
  name: string;
  label: string;
  val: string | number;
  unit?: string[];
  selectUnitIdx?: number;
  type?: string;
  preset?: (string | number)[];
  children: Record<string, StyleDto>;
};
