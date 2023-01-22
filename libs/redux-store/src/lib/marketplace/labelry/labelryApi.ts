import axios from 'axios';

export interface labelData {
  printDensity: number;
  labelHeight: number;
  labelWidth: number;
  labelIndex: number;
  zplString: string;
}

export const getLabelImage = (data: labelData) =>
  axios.post(
    `http://api.labelary.com/v1/printers/${data.printDensity}dpmm/labels/${data.labelHeight}x${data.labelWidth}/${data.labelIndex}/`,
    data.zplString
  );
