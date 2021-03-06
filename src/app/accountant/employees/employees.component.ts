import { Component, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/services/accountant/employees.service';
import * as XLSX from 'xlsx';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  username = localStorage.getItem("username")

  constructor(public employeesService: EmployeesService, private spinner: NgxSpinnerService) {
    this.employeesService.employeeList();
   }

  ngOnInit(): void {
    this.getFinancialList()
    var ID = localStorage.getItem("userID")
    this.getUsername();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 700);
  }

  exportToExcel(tableID: string){
    let element = document.getElementById(tableID);
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, tableID + ".xlsx");
  }

  exportToPDF(tableID: string){
    let data = document.getElementById(tableID)
    html2canvas(data!).then(canvas => {
      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;
      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jspdf('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
      PDF.save(tableID +'.pdf');
  });
  }

  getFinancialList(){
    this.employeesService.getFinancialList()
  }

  getUsername(){
    this.employeesService.getUserByUsername(this.username!)
  }
}
