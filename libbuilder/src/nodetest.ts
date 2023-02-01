import { ZSSService } from './lib/ZSSService'
import { readFile } from "fs/promises";

readFile("./testdata/template.xrns").then((data) => {
    console.log(data);
    const zss = ZSSService.getInstance()
    zss.import(data)
});
