# gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf

# gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=capg1_Auxiliar_Administrativo-compressed.pdf capg1_Auxiliar_Administrativo.pdf
# capg1_Auxiliar_Administrativo.pdf

# http://www.ubuntugeek.com/ubuntu-tiphowto-reduce-adobe-acrobat-file-size-from-command-line.html
# convert dragon.gif -resize 120x120\>  shrink_dragon.gif
# convert dragon.gif -size 120x120\>  shrink_dragon.gif

# online url to pdf: https://docs.zone/web-to-pdf
# http://www.pdfaid.com/html2pdf.aspx

for pdf in *.pdf
do
  echo "Processing $pdf"
  mv "$pdf" "orig_$pdf"
  gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="$pdf" "orig_$pdf"
  rm "orig_$pdf"
done

