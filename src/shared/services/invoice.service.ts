import { Injectable } from '@angular/core';

declare var pdfMake: any;

@Injectable()
export class InvoiceService {

  public createPdf(invoice) {
    return new Promise((resolve, reject) => {
        var dd = this.createDocumentDefinition(invoice);
        var pdf = pdfMake.createPdf(dd);

        pdf.getBase64(function (output) {
          var raw = atob(output);
          var uint8Array = new Uint8Array(raw.length);
          for (var i = 0; i < raw.length; i++) {
            uint8Array[i] = raw.charCodeAt(i);
          }
          resolve(uint8Array);
        });
    });  
  }




   public SharePdf(invoice) {
        return new Promise((resolve, reject) => {
            var dd = this.createDocumentDefinition(invoice);
            var pdf = pdfMake.createPdf(dd);

            pdf.getBuffer(function (buffer) {
                var raw = new ArrayBuffer(buffer.length);
                var uint8Array = new Uint8Array(raw);
                for (var i = 0; i < buffer.length; i++) {
                    uint8Array[i] = raw[i];
                }
                resolve(uint8Array);
            });
        });
    }


 
   
   

  public createDocumentDefinition(invoice) {

    var items = invoice.Items.map(function(item) {
        return [item.Name, item.Brand,item.Quantity, item.Price, item.Amt];
    });

    var dd = {
        content: [
                      
           { text: 'WINTECHES', style: 'orgname'},

            {image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAB2AMADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKD0ozSOQqkngCgCFnO/oOnr1r5+/aa/4KCeCv2bFmsJ5W13xGiZ/sqwfMkX/XZ/+Wf05f8A2DXin/BQT/go7N4V1K/8CfD67Ed9b/udU1iJ/wDj3fr5MP8At/337V8A3F215cPLIzs0j797vzX61wX4aVMxhHG5k+Sn/L1kfzb4n+OdPKas8syP360fin9mP/yUvwPor4w/8FR/ib8UZ5oLC/j8JabKMLDpY2XB+sz/AD/98bK8E8R+MtX8Waj9p1fVNS1e4+/515dPNJ/4/XQfCT9n7xZ8btV+zeHtGnuk37HuX+S3jf8Aub/7/wDsffr6Y8If8Ea/FWs6Vv1LxRp2nXLp8kaWryRj/ge9H/8AHK/UpY7hXh5exjyQl/4FL/5I/BKWTcd8Yf7Q1Vqx/vS5Y/8Abvwx+4+OYri4RyUlcP8A3/MrtvAP7TnxD+F8yf2H4x8RWSRdIftzyQD/AIA/yV9T6t/wRb1SOzj+y+J7USJ/rG/1m/8A3E2J/wCh15h8Tv8Aglv8Rfh9p73lmlprNtH8+xH8if8A+I/8fqYca8NZj+5rTh/29H/5I1qeFnHOSf7XRozX/XqXvf8Akr5j0H4E/wDBYvxFoM0Fp4/0iLW7LOyS/sUSG6j/ANvZ9x//AByvuj4MfHHwv8dvCaav4W1S11Gy+44Q7ZIH/uOn8Br8T9a0O/8AC2qzWOpWd3Y3lu+x4blNkkf/AACuj+CPx08R/AHxxHrvhq+e0uE+SeHO+C8T+46fxpXgcReF2X42h9Yyj3Z/+SSPsOCfHjN8sr/UeI/3tL+b7cf/AJL8z9wycHAxS5GOleMfslftV6F+1d4CTUdPC2mrWYWPUdPkb95aSdT/ALycfI/evZgvIJPav55xeDrYWtPDV4cson9kZZmeGzDCwxmDnzwmPooorI9AKKKKACiiigAooooAKKKKACg9DRQelAFfcEXAU8Cvmv8A4KSftWP+z18Izp+lThPFPiXdbWTocvZRY+eb64+5/tkf3TX0q0gRCc9Oc1+O37enxsn+N37TPiK/DsdP0eX+zNPUchYYXdN//A33v/wOvufD7h2Ga5tCNVe5D3pH5H4y8ZSyDIJyw8v31X3I/wDt0vkeNSSNIzuzl5ZPvv6V9R/sFfsEt+0Bfx694j3weHrd98dt/wAtL3/f/wBj/wBD+evIf2WvgnN+0H8ZdO0ILJ9j3+dfOn7vEG/+/wD7buif8Dr9hvBHgex+H/hq20vTYo4obdAgCIY9+B/n/dr9R8SuMnl9P+zMBP3pfF/dPwHwQ8M6WdVZ55m0eelH4Y/zS/8AkYh4C+Geh/DPRIbLR7C2tYbePyUCJ0T+59P9muo2gdTQpwDSbhjPWv53bcneR/adKlGlFU6ash+OKCOO1GeKM1JueC/tQ/sVeGP2hPDMqTafHaanGmLW5g+SSI+ie2P4D8h9vvp+Wnxu+C+s/AXx7c6JqsMmf+WE3l7I7hK/b5n+YAEZb9a+a/8Agob+yzB8dvhRc3thADr2l/v7Rk/jcdv+B/c/74/uV+j8A8a18sxccLiZ3oT/APJf7x+GeLnhbhc8y+eNwULYqGun2v7sv0Pzk/Zs+Peqfs2fFew8Qaa0kkMT7L623/Jd238aV+yfgLx5p3xH8J6brelSpc6bq1sl1BJ2ZHGa/DBWJyOpav0T/wCCOHxul8QfDrW/A95J8/h2ZbuxP/TGZiXjH+4//o4V914ucO06mFhm9D44/F/hZ+UfR34yrUMdPh3FS92XvQ8pL4l8/wBD7foo60V/Px/ZQUUUUAFFFFABRRRQAUUUUAFB5FFFAHFfG/xU3gX4O+K9ahYGbR9JublP95Inda/EBlxOSeh/xr9ov2yY2uf2XvHyR/fOh3TD/v2a/FxzvVB+FfvfgvRh7LE1H/dP47+k7Xn9cwVH7PLI+6P+CSvwxuoPCfiLxVp9pp99qX277LALuZ4Ej8tOu9Ef76TN/wB8V1Pxm/4KleKvgF49u/DfiD4Z2cN7ZjzA8etSPBcJ/BIreR936itz/gkJqK3PwG1C3i2yeTc4kwf9W/mTf+ybKzv+Cv8A8C18WfCfTvHNnbhr3w3P9mvGQY8yzmcD/wAcfZ+DvXzc54DGcXVcPmtPnhOfL9pf4T7hUc1y3w8w2O4fq8k6VKM5e7H3ub3pfFH5nu/7OHxc8XfGzwbo3iPUvDujaFpWrw/aoY01Vrq5ER+4xHkhPf7/AHrs/iLqniTTNGD+GdM0fU7rkvDfX0loHH+yyI/8q+ev+CTXxuX4lfs+P4bu5RJf+DZfsvP35LZ/nhc/+Pp/2zNfVsq/uyRgY6d6+Ez3AvAZpWwsoW5JP7un4H6twdmX9r8P0MZTrSk5w+P3ebm+19nl+I+B9b/4LG65oXiK70i7+GkEOoWNy9rNAdYfekyPsdP9R/fr69+F/ibxnr2nQ3HibQtH0RZ4Q/kWupPdTQuf4GJhRPyr8vP23vDl7bfGO48eJbpa6Z4zvLy70ySPpm1uXh3j2dESb/ttX6l/An4kxfFv4Q+HPE0IVRrdhDcsidI3ZPnTP+y+78q+t40ynL8Nl+FxWX0uXn+N+9pP+Xf/ABfcfm3hdxJm2YZ1jsvzXFSn7Hl5FyxjzR/m+H/D/wCBFP4yeKvFXgzw1dap4a0LTNeksoHle1uNQe1d9gzhPkdfzryL9lv9q3xp+1rpl3eR+AtN0XwwHNpNez6y8guOPnWJPI+b73UkCvYf2gvEM/hz4P62bF4xqt9D9g09W/ju5iIYR/326Va+CXwt0/4M/CrQ/DengNa6ParbbvL2GVv43/4G/wA3418dh6+GpZdL2tGMqspe7L3tF9r7Vu34n6Vi8Jjq2dwdHESjRjDmnH3fi+z9nm/m5vkfkX+114LT4e/tE+K9MRPIQ3X2rZ/zz85PM2f+P16X/wAEn/HUvhj9rzTdPQZh8RWVzZze2yPzk/SE1zv/AAUahRf2tvEx6OX+f/vt/wD2TZUf/BN3zpv2z/BIi+/50/8A3x5Em+v6PxEvrfBs5Vv+fX/tp/GOEg8B4lKOH/6CP/SpH7DjpRQBgUV/LB/oGFFFFABRRRQAUUUUAFFFFABQeBRQehoA5j4m+Ex44+Hmv6SxyNW06ezOf9tHT/2avw1vtOm0u6nt7hZI5raTY6P/AAV+85Id9pBAYcf1r8if+CjHwQm+Cv7TevGG3dNH8SP/AGvZP/B+8++n/AH3/wDjlfsfg5m0aWNq4Gf/AC8S/wDJT+Y/pJ5BPEZbh81h/wAupcsvSX/7P4nuX/BGv4nxWt34i8LTzBDJJ9ugQ/8ALUvsR3/NET/gdfc3xC8EWXxL8C6toGoxeZZ6vbSWsy56o6YNfjN8APjLcfAj4t6V4ktvM8uzfZdIn/LSH+P/AIH/AB/79fsd8K/ifpnxX8D6frWnXEN3BeQLJvSvN8Tsjr4DNlmNP4Kuv/b39anu+BnEuFzjh15RiH71K8eX+5L4f8j80f2KPGF5+yX+24fD2tOIba8upvDl/wAfJv3/ALmQf7G9E/4BJX6PfHvxLPoPws1D+zpfI1fVPL0vT5FP+ruLmQQxv9Edw5/3K+Fv+CwXwSbwr8VdJ8dWUZjtfEcYt7xk/wCWVzD9x/q6bf8AvxX0P+yx8aT+1ha/D26kYzSeF9Nk1LWDxn7dh7KHcPR/9Ml/BK34uoQzHC4TiKC3jaf+OP8An8J5fh3jK2SY7MOC6svejO9L/BP/AORj733mP/wUz/Z3tdU/ZAs5NItlj/4V95UltGnJS02eTIn0CFX/AO2Yqn/wRz+LZ8V/AvVPCtxMHu/Ct7uhTuLaf94n/j/nV9S+M/DNr448IarpF+nnWeq2ktrMnrG6bGFfmb+wP4zuP2Xv20NR8Paxcx29rIl5o19K5xGjwb3R/wAof/Ilc+Queb8N4vL5fHR/ew/X/wBu/wDAj0OK6ceHeNsvzmPu0sRH2U/X7P8A7b/4CfoBr8b/ABA+P+l6dtB03wVbf2tcscfvLuffDbJ/wBPtLn/fhNekanqEWmWUtxJ9yFCxrg/gDpE8fgabXdSjlh1XxXcvrF2sg/eQq+BDE/vHAsMf/AK8S/4KWftZ23wh+G1z4f0m5jbxDrkbwRhG/wCPdP45D9On++U/uPXxOEy2rmGNp5fQXXl/+S/rsfqWJznD5RlVbOcc+WPxf/Ix/wAVrL1Pz6/aa+IC/FH45eJdZSbz4Z7ryIJP+ekKfu0f/vhK9m/4JJeB/wDhJv2soNRKOV0DS7i63/3Hf9z/AO1nr5f6R/71fph/wSJ+Bsnw7+Cl94tv4njvvF00fkB8fJbQ52H/AIE7yH6bK/objrE0cp4Y+ox6+5H+v8J/G3hRga3EXG39p1PsTlVl+n/kx9jdaKByKK/l8/voKKKKACiiigAooooAKKM0UAFB6UZHqKQng80ARgc55yeMV8/ft9/ssR/tQfB2aGyhgXxJoRe60uZ/43x88X/A/wD0NEPavfkcgLnqBmnE7j0wpHNdWAxlbB4mGJoS96Gp5ec5VhszwVXAYuPNCa5T8F9S0q50PVLiyvIZLS9t5HgnidNkkbp99Hr279jv9tjV/wBmPWUspS9/4euH/eQ48yS3/v7P/iK+w/29v+Cd1t8doZfFPhJYLTxjEn76Fzsj1ZE7f7E3QB6/NbxD4a1PwZrlzp2q2F1pupWb7Jra5TZJG/8AtpX9Q5XnGU8W5b7Gv8f2ofy/3o/5n8GZ/wAO5/4e5zHGYWXufZn9mX92X+X3H6d/HTxR4U/bq/ZY1ix0O7tpdTkjFzpyh/8Al7X50RHA++53Js+/hz8lWf8Aglv8ELj4Rfs4Q3up2r2eq+J7h9QuY5k2SIn3IV/74QP/AMDr8wvCXjnWPA2o/bdH1G+024+5I9s/l+an9x/76f7Fe3+Bf+Cn/wAVfBNokJvtM1JY/k33kD/u0/2ER0j/APHK+Kzbw8zehgJ5bl0+elKXNZ6S/wAj9IyHxg4dxWcUs+zmlKliIw5Pd96P+L+b/hz9atglBJ6GvhX9oz9j5PFX/BQzRdauLVYfCWrWqazqty42QI9t8jwu33MP+5/77krye7/4K+fEJrVxDY6UJH6ed/qx+CbH/wDH68o+I/7bPxE+KcgW61uewgj+4lq7iSP/AHJnd5//AB+vM4Y4C4iwdacocsOeEo/F/N6H0PHHi3wZmuEhSqc9XknGfux/l/xcp94/taf8FDfD3wMtJtK0SdNQ11k2eVG43oMHr/zz69X5OBsQ796fmt8R/iPq3xU8Y3mt6zc+feXb/wDbONP7iVhSTvK5Jfex/jNepfswfsjeLf2oPEf2bQ7X7LpdvJi91W4j/wBEg/8Ai3/2K/Rsi4byzhXCzxOIl7/2pS/9tPxfirjfP+PcZDL8JSfs/s0o/wDpUv6siz+xp+y7dftQfFy10oLPDodhsudXuV6Rw/3P99/uJ/8AYV+wHh3QbPw1ottYWcKW9raQpDDGvCxonCrXGfs6fs6eH/2Z/h1F4e0CH5f9ZdXUv+vvpv77n1r0fHzduR+dfg3GfFdTPMbzx/hQ+A/rXwt8PKPC+WKE1zYifxy/9t/wxJR0ooHSivjz9QCijIozQMKKKKACg9KKD0oAg34GR933pWkUHBIB7Z4zXHfFL4cWfxS8M/2XdS3MdrJcwzzLDO8X2hEcPsLIc7Hx6189/t6aJaeDdV+EUGkRRabDd+MbS0nS3QRieIN9xx/Eld+WYCOMqxoKXLKXN07anzWf57WyvD1MXKlzRjy/a/mly/yn1qW+YAMvPWgqN2AAD7ivOtR+BWiP4v8ADuu2MK6ZfaNcPJi1PkJcpJHIjo6r8rj59/POUrdvPidoVgZxJqcYjsn8m6lRXeG1f+67j5E/4H61zOmmv3fvHp0sY1d4hcv/AG8dWRxTuAtc/rPi+w8O20ct5eJCs7pBAD/y3d/uIi/xv7JWZp3xd0HWdYXT7fU4Zr2QTDyArF0dPvo39x07ocPWcKVSUeaMTaeNoQlyymda6jduP1ryr9oL9lDwR+0xpKxeJNJD30ce2DUbYeTdwfR+4/2XyK6rS/itoup3dpHFqcLf2kNtm5V0iu+P+WTn5Jf+AE1zeifHHTvF/wAWPFvg8291J/wjcdpBPJ9kmdJJrlHdkyE2bAnk/O399xXVgo4ujU9vh+aEo+9df+Anm5pUy3FUPq2MUJwqe7yy+17vN/6SfEnxh/4I7+LvDs88/gzV7HxHZAZWC5P2W6Ht/cf/AL7SvA/E/wCx/wDFHwhcvb33gHxTGY+fOg0954P++0+Sv0K/Yx8X6J8OPAXjqKaR7W3svGerpsjiaX7LAk5RWfYDsTCZ3v8AnXvkPj3SB4VTWpNRsU0mSJZkvDMnkSI33X39Me9fp1PxLzzAVJUKtqq/mceX/wBJPwV+CnCmb0I4ujOWHlL3uWMuaMf/AAKJ+L9v+z746vpCkXgzxRK/9xdKn/8AiK7/AOHf/BOn4u/Ed0kh8H3ukW0n/LbVHSy8v/gD/vP/AByv1g0vxzo+o3stjHeKb6BFllt3RoZ0Q/x7H+fbWBbftGeCrnTLO7i8RWUtrd3v9npMm9087f5ex/7h3/L8/et63ixnNSny4ahFf+BGOD+j5w1Qqc2Lxsp/9vRifMXwA/4I7aN4buoL/wCIGrnXpYzu/s6x3wWg/wB9/vv/AOOV9jeE/CWm+C/D0Gm6RY2um2NomyG3tofLjjHstS67rVnoGj3F/fXMNnZWiedNNM+yONP7xasXw78WNA8Saha2lpqkcl3f2/2u3gdHie6ix9+JH5dMf3a/N81zvMs2qe1xs5Tt/wCAo/beHuGMj4ep+wy+nGlzf+BS+fxHTpcLOGEbZeMY+lSJHj0x2IFfOPwHFj4R/a/+OMCokSP/AGROkUKbmkb7M7syovP3j+bV7X4d+Imh+LtBfVNO1SzutOhDiS4SYCOPZnfvPRNuDXHjsBOhPkh73uxf/gUVL9T0spzqni6PtJ2hLmlHl5v5ZOJ027ccDbQBtIztrldG+KOhatPZwWmqW8jahCJrPnCXyYB3xP8AcdcEfc+tUr/46eFdNvNQil1uyiTSpltr6Y/6mzmfojy/cRunD461h7Gtfl5T0pY/DxhzynE7VVKgngD2GaVZFYjkBj09a5/xF4303whawSajfwWS3UyW1v5j5e4lf7kaL/G5/up714b9q07Vv+Chmj3Fg226n8I3kd2ux4ZCUubfZvRvxrfC4OVfm6csZS/8BPNzLOqeE5Ir3pSnGPxfzH0wOlFAGBRXEe+FHSig9KAK9wvmKMehr5J/4KZ6vbaZ4n+DiySJHs8YW9zy+PkR13t+HFfXUYBXIJ4rkvFXwc8JeP7wXes+G9C1S7C7POu7CGaQ/i616WUY6GDxMcRUV+W/4qx81xXlFXM8ungqU+WUnH/yWSkHxMg1W7+Gutp4fdU1mTTrhNPbdtxceWwjP/fe2vL/ANj+80uy/Y10tNV8qC20yyubbW4b0/8AHvOjP9qSff0fzN+/f717Xo+hWugaTFZ2VvDbWkCBYYYk2JGvptrO1D4e6Jqk8s91pGmzyzMrSPJbI7ybPuflWVHFwhQlh1tzc3n1/wAy6+UzniYYyL95QlDl+z73L/8AInyh8OdRf4ZfBj4J6p4w1mPRtS0q7vJtPg1mb7PayWzpIiJLK4JR0gkR0+mzHdN7xtYL4n/Zx+MuseDfEel+Ib/xPdi9li0S6S6jtogkELx7l+87wwsX7/Ma968aeAl1/wARWOoSQRalaW6eV9knnZYkfd/rfL+47/w4eua8A/s/weD/AI7ax4ys7LSdDhvtMTTBY2Ayk+yV3+0S/KmH52454/jr11mtGXNW+GXxf3fi5uU+TfDeJpOOGj70fh+1zR/d8ntP5fkUfAnhPwf8Uvhd4T1kajfXmlWElpqGnr9vbZBOjDYnyH76P8mz1+T2rK+AcsUH7Y/x33lEHmaK3P8Ad+wf/rr1zTfhX4c0TW5dSs9C0a1v5W3vPDYxxzSN67+tJqHwy8ParrrapdaJpN1qhh8j7ZLZo8+z+5v252V59PMY2qx97lnH/wBujL/209+WQVm8PP3ealLm/wAXuyj/AO3Hj37DwsD4R+J0sJiff451sSn/ALbmvFLrWZtK/ZE+AmsSTXA8OaR4jhfWbiN8C1TzpkSZz/zzSTH/AI5X2FoXwk8KeG7G8tNO8OaJZ29+P9Lht7CKNLj/AHxt+b8at6V8ONA0fQZdMs9G0u002b/W2kNokcUmf7yhea7aWeU6daVblveS3/wuP/tx5dThLEVcHDDKcY8sZR0/m5oy/wDbdTnrT4Z+HYvH+leIWub281c2kltaTSXjvvhfDuNn3Nv3OceleffsF29l/YHxE8tYXL+P9Ydiv8Z85dvPrjbXr/hX4W+G/A9rNDo+gaPpUNwuyZLWzhgR19G2DkVL4L+G3h74fpP/AGHo2laR55/e/Y7NIPM/74Arz3jo+xqU/elzcv4HsQyWf1qjieWMeTm5v+3uX/5Ezfjb410/4b/CrXdb1a1k1HTdPtHkmtEVXNwn93D8GvE/GWvT69+0/wDs/alffY7C6uItVlWzhff5SS2GVTf0f7h6D+CvpHV7CLV7aS2lRJYZ0KPG67kce4rBn+DfhW50e20+bw9octhZus0Fs9jE8cDr9x0Tb1/lTwOLpYdPmjupf+TR5Ss5yjEYyceSXuLll/29Gal+ny8zyv4CQQv+2h8dZBtaQxaED7f6JJj+deI6/wD2jdfsoftDnRo5pnXx9eG6S3++8Hn23ng/7Hl79/8Asb6+xdJ+FHhvQ9Xu7+w0LRrO/vlK3FzDYRRyXHszhct+NTeGvhn4c8GLcto+g6RpTXh/ftZWSQeef9vYlejTzyFOt7aMb/w//Kaivx5Tw6/CNath/q8p8v8AGf8A4N5v/SeY4rRfB/g34keGvCviKLVbrUNMsriHUNJdbv8AdJNgomNnb59myvIP2i/iZF8Q/wBmH4yppGmWuk6NoFzc6ZcysgF1qV4hTfJsHC87MO+93z/Bivorwv8AB3wn4L1J7vR/DWhaXqEg+e4trCKGT/vpVq4vw50UaldXh0nTWvL3BuLg2yb5/k2fO38fycfSuGjmdKliI1nzS5XeP/gV/wCmejiuH8RiMG8N7seaMoy5f8PL/S/E+eNVvGj/AGo/gjfatMsmhTaDPDp0zEeR/abxJ1/23h3bPoa2Na1Gzi/4KWaFEJrdLh/BlyjqGw5BuQw/9nb8K9rg+GPh218Ppo8WgaNHpER3LZpZoII2/wBwDZUJ+D/hb+3bHUT4a0EalYA/ZLr7BH58H+4+3KfhXW82pvWUfsSj/wCBX1/8mOOPC+JgrQnH+LCp/wCA8seX/wAl0OyHSigcUV8+foAUEZFFFAELgoox145oKCKPI6Dt60UVlGbc+V7Ez0jzLfUfncuQSKgkbDAZxn2FFFbx3HTipLUkxsGc5PA5odfL+b+7miiok7LQmKvKz8gKnaTkjI/Ko3YK4GMMR96iilzO9iavuxTXcnA4zx+VJt3Z6UUVnObUrI0STWomMdMCnEcZ9aKKihUlKVmxzSS0AIW5o25zRRXTJWu0RF30YinApkhKkdPyooqOZqdgqe7G6JQvfj8qDgcelFFUlYad9xpAJoIz9RRRRYoihJkBbd09qk3bn25wfWiis18XL0sTSfNC7P/Z',
            style: 'header', alignment: 'left',
            fit: [100, 100]
            },
            { text: 'QUOTATION', style: 'header'},
            { text: invoice.Date, alignment: 'right'},

          

            { text: 'To', style: 'subheader'},
            invoice.AddressTo.Name,
            invoice.AddressTo.Address, 

            { text: 'Items', style: 'subheader'},
            {
                style: 'itemsTable',
                table: {
                    widths: ['*', 50, 50, 50, 50],
                    body: [
                        [ 
                            { text: 'Name', style: 'itemsTableHeader' },
                            { text: 'Brand', style: 'itemsTableHeader' },
                            { text: 'Quantity', style: 'itemsTableHeader' },
                            { text: 'Price', style: 'itemsTableHeader' },
                            { text: 'Amt', style: 'itemsTableHeader' },
                        ]
                    ].concat(items)
                }
            },
            {
                style: 'totalsTable',
                table: {
                    widths: ['*', 75, 75],
                    body: [
                        
                        [
                            '',
                            'Total Qty',
                            invoice.TotalQty,
                        ],
                        [
                            '',
                            'Total Amt',
                            invoice.TotalAmt,
                        ]
                    ]
                },
                layout: 'noBorders'
            },

            {text: 'If you have any questions concerning this quotation, Please revert us back', style: 'footerstate'},
            {text: 'THANK YOU FOR YOUR BUSINESS', style: 'footer'},
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true,
                margin: [0, 0, 0, 10],
                alignment: 'right'
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 20, 0, 5]
            },
            itemsTable: {
                margin: [0, 5, 0, 15]
            },
            itemsTableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black',
                fillColor: '#D3D3D3'
            },
            totalsTable: {
                bold: true,
                margin: [0, 30, 0, 0]
            },
             orgname: {
                fontSize: 20,
                bold: true,
                margin: [0, 0, 0, 0],
                alignment: 'left'
            },

             footerstate: {
                fontSize: 13,
                bold: false,
                margin: [0, 50, 0, 0],
                alignment: 'center'
            },

            footer: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 0],
                alignment: 'center'
            },
        },
        defaultStyle: {
        }
    }

    return dd;
  }

}
