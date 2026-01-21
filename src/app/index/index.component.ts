import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {} from '@angular/common/http';
import { WorldbankService } from '../worldbank.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  zoomLevel = 1;
  isMobile = false;
  @Output() clickedCountry = new EventEmitter<string>();
  constructor(private worldBankInfo: WorldbankService,
) { }
countryData!: any;
//Access the paths in the svg file and waits for a user click.
ngOnInit(): void{
  this.checkIfMobile();
  window.addEventListener('resize', () => this.checkIfMobile());
  
  const accessSVG = document.querySelector('svg');
  const allPaths = accessSVG?.querySelectorAll('path');
  allPaths?.forEach((path: SVGPathElement) =>{
    path.addEventListener('click', this.chosenCountry.bind(this))
  });

  // Add zoom listener for desktop
  if (!this.isMobile) {
    const mapContainer = document.querySelector('.map_column');
    mapContainer?.addEventListener('wheel', this.handleZoom.bind(this), { passive: false });
  }
}

checkIfMobile(): void {
  this.isMobile = window.innerWidth <= 768;
}

handleZoom(event: WheelEvent): void {
  event.preventDefault();
  const zoomStep = 0.1;
  const delta = event.deltaY > 0 ? -zoomStep : zoomStep;
  this.zoomLevel = Math.max(1, Math.min(10, this.zoomLevel + delta));
}

setZoomLevel(level: number): void {
  this.zoomLevel = level;
}

getTransformStyle(): string {
  return `scale(${this.zoomLevel})`;
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


