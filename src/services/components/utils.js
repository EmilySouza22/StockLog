import JsBarcode from 'jsbarcode';
import moment from 'moment';

export function gerarCodigoBarra(DOMtarget) {
	return JsBarcode(DOMtarget);
	// .options({ font: 'OCR-B' }) // Will affect all barcodes
	// .EAN13(gerarNumeroCodigoBarra(), { fontSize: 18, textMargin: 0 })
	// .blank(20) // Create space between the barcodes
	// .EAN5('12345', {
	// 	height: 85,
	// 	textPosition: 'top',
	// 	fontSize: 16,
	// 	marginTop: 15,
	// });
}

export function gerarNumeroCodigoBarra() {}

export function formatarData(dataISO){
    return moment(dataISO).format('DD/MM/YYYY')
}