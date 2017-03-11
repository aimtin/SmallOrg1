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

  private createDocumentDefinition(invoice) {

    var items = invoice.Items.map(function(item) {
        return [item.Name, item.Brand,item.Quantity, item.Price, item.Amt];
    });

    var dd = {
        content: [
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
                            'Subtotal',
                            invoice.Subtotal,
                        ],
                        [
                            '',
                            'Shipping',
                            invoice.Shipping,
                        ],
                        [
                            '',
                            'Total',
                            invoice.Total,
                        ]
                    ]
                },
                layout: 'noBorders'
            },
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
                color: 'black'
            },
            totalsTable: {
                bold: true,
                margin: [0, 30, 0, 0]
            }
        },
        defaultStyle: {
        }
    }

    return dd;
  }

}
