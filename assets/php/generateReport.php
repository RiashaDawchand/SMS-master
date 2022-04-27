<?php
  require 'connection.php';
  require('../FPDF/fpdf.php');

  $month = date("M Y");
  $title = "STOCK REPORT // $month";
  $filename = "../docs/Stock Report $month.pdf";

  $query = "SELECT	a.product_id, b.product_name, a.change_type, a.old_quantity, a.new_quantity, a.update_date, (b.mod_time) AS Scan_date
            FROM	record a
            INNER JOIN stock b ON a.product_id = b.product_id
            WHERE DATE(CURRENT_DATE) - DATE(a.update_date) <= 30;";

  $result = mysqli_query($conn, $query);

  $totalQuery = "SELECT SUM(quantity) AS total, COUNT(product_id) AS prod_count FROM stock";
  $totalResult = mysqli_query($conn, $totalQuery);

  class PDF extends FPDF
  {
    function Header()
    {
      global $title;
      $this->Image('../img/logo.png',10,6,70);

      $this->SetFont('Helvetica','B',15);
      $this->Cell(80);
      $this->Ln(20);
      $this->Cell(200,10,$title ,0,0,'L');
      $this->Ln(10);
    }
    function Footer()
    {
        $this->SetY(-15);
        $this->SetFont('Arial','I',8);
        $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
    }

    function showTable($header, $data, $totals)
    {
      $this->SetFillColor(55,63,81);
      $this->SetTextColor(216, 219, 226);
      $this->SetLineWidth(0);
      $this->SetFont('Helvetica','B');

      $width = array(40, 50, 45, 40, 40, 40);
  		for($i=0;$i<count($header);$i++)
      {
  			$this->Cell($width[$i],12,$header[$i],0,0,'C',true);
      }
      $this->Ln();

      $this->SetFillColor(216, 219, 226);
      $this->SetTextColor(55,63,81);
      $this->SetFont('Helvetica');

      $fill = false;
  		foreach($data as $row)
  		{
        $this->Cell($width[0], 10, $row['product_id'], 0, 0, 'L', $fill);
        $this->Cell($width[1], 10, $row['product_name'], 0, 0, 'L', $fill);
        $this->Cell($width[2], 10, $row['change_type'], 0, 0, 'L', $fill);

        $date = date_create($row['Scan_date']);
        $this->Cell($width[5], 10, date_format($date, 'd M Y'), 0, 0, 'L', $fill);

        $this->Cell($width[3], 10, $row['old_quantity'], 0, 0, 'L', $fill);
        $this->Cell($width[4], 10, $row['new_quantity'], 0, 0, 'L', $fill);

  			$this->Ln();
  			$fill = !$fill;
  		}
      // For totals
      while($row = $totals->fetch_assoc())
      {
        $this->Ln();
        $this->SetFont('Helvetica','B');
        $this->SetLineWidth(0);
        $this->SetFillColor(55,63,81);

        $this->SetTextColor(216, 219, 226);
        $this->Cell(90,10,'Number of Products',0,0,'L',true);

        $this->SetTextColor(55,63,81);
        $this->Cell(45,10,$row['prod_count'],0,0,'L',false);


        $this->SetTextColor(216, 219, 226);
        $this->Cell(80,10,'Total Items',0,0,'L',true);

        $this->SetTextColor(55,63,81);
        $this->Cell(40,10,$row['total'],0,0,'L',false);

      }
    }
  }


  try {
    $pdf = new PDF('L');
    $pdf->AliasNbPages();
    $header = array('Product ID','Product','Change Type','Date', 'Old Quantity','New Quantity');
    $pdf->AddPage();
    $pdf->showTable($header, $result, $totalResult);
    $pdf->Output('F', $filename);

    echo '1';    
  } catch (Exception $e) {
    echo '0';
  }


 ?>
