import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {} from '@angular/common/http';
import { WorldbankService } from '../worldbank.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})

export class IndexComponent implements OnInit{
  countryName = "";
  countryCapital = "";
  countryRegion = "";
  incomeLevel = "";
  longitude = "";
  latitude = "";
  @Output() clickedCountry = new EventEmitter<string>();
  constructor(private worldBankInfo: WorldbankService,
) { }
countryData!: any;

ngOnInit(): void{
  const accessSVG = document.querySelector('svg');
  const allPaths = accessSVG?.querySelectorAll('path');
  allPaths?.forEach((path: SVGPathElement) =>{
    path.addEventListener('click', this.chosenCountry.bind(this))
  });
}

chosenCountry(event: MouseEvent){
  const path = event.target as SVGAElement;
  const countryID = path.id;
  console.log(`Country ID Clicked: ${countryID}`)
  const apiUrl = `https://api.worldbank.org/v2/country/${countryID}?format=json`
  this.countryData = this.worldBankInfo.getData(apiUrl).subscribe((countryInfo: any) =>{
    this.countryName = countryInfo[1][0].name
    this.countryCapital = countryInfo[1][0].capitalCity
    this.countryRegion = countryInfo[1][0].region.value
    this.incomeLevel = countryInfo[1][0].incomeLevel.value
    this.longitude = countryInfo[1][0].longitude
    this.latitude = countryInfo[1][0].latitude
  console.log(this.countryData)
  })

}
}


  // const svgElement = this.elementRef.nativeElement.querySelector('svg');
  // const pathElements = svgElement.querySelectorAll('path');
  // pathElements.forEach((path: SVGPathElement) => {
  //   path.addEventListener('click', this.handleClick.bind(this));
  // });





// handleClick(event: MouseEvent) {
//   const path = event.target as SVGPathElement;
//   const countryId = path.id;
//   this.countrySelected.emit(countryId);

// };


