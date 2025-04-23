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
//variables set up to store received API information to display on frontend
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
//Access the paths in the svg file and waits for a user click.
ngOnInit(): void{
  const accessSVG = document.querySelector('svg');
  const allPaths = accessSVG?.querySelectorAll('path');
  allPaths?.forEach((path: SVGPathElement) =>{
    path.addEventListener('click', this.chosenCountry.bind(this))
  });
}

//receives country code based on the country the user clicked and stores it then sends it to the API call service.
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


