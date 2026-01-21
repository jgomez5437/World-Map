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
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  translateX = 0;
  translateY = 0;
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
    mapContainer?.addEventListener('wheel', (event: Event) => this.handleZoom(event as WheelEvent), { passive: false });
  }

  // Add drag listeners for all screen sizes
  const mapContainer = document.querySelector('.map_column');
  mapContainer?.addEventListener('mousedown', (event: Event) => this.handleDragStart(event as MouseEvent));
  mapContainer?.addEventListener('mousemove', (event: Event) => this.handleDragMove(event as MouseEvent));
  mapContainer?.addEventListener('mouseup', (event: Event) => this.handleDragEnd(event as MouseEvent));
  mapContainer?.addEventListener('mouseleave', (event: Event) => this.handleDragEnd(event as MouseEvent));
  
  // Add touch events for mobile drag
  mapContainer?.addEventListener('touchstart', (event: Event) => this.handleTouchStart(event as TouchEvent));
  mapContainer?.addEventListener('touchmove', (event: Event) => this.handleTouchMove(event as TouchEvent), { passive: false });
  mapContainer?.addEventListener('touchend', (event: Event) => this.handleTouchEnd(event as TouchEvent));
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

handleDragStart(event: MouseEvent): void {
  if (this.zoomLevel > 1) {
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
  }
}

handleDragMove(event: MouseEvent): void {
  if (!this.isDragging) return;
  
  const deltaX = event.clientX - this.dragStartX;
  const deltaY = event.clientY - this.dragStartY;
  
  this.translateX += deltaX;
  this.translateY += deltaY;
  
  this.dragStartX = event.clientX;
  this.dragStartY = event.clientY;
}

handleDragEnd(event: MouseEvent): void {
  this.isDragging = false;
}

handleTouchStart(event: TouchEvent): void {
  if (this.zoomLevel > 1 && event.touches.length === 1) {
    this.isDragging = true;
    this.dragStartX = event.touches[0].clientX;
    this.dragStartY = event.touches[0].clientY;
  }
}

handleTouchMove(event: TouchEvent): void {
  if (!this.isDragging || event.touches.length !== 1) return;
  
  event.preventDefault();
  
  const deltaX = event.touches[0].clientX - this.dragStartX;
  const deltaY = event.touches[0].clientY - this.dragStartY;
  
  this.translateX += deltaX;
  this.translateY += deltaY;
  
  this.dragStartX = event.touches[0].clientX;
  this.dragStartY = event.touches[0].clientY;
}

handleTouchEnd(event: TouchEvent): void {
  this.isDragging = false;
}

setZoomLevel(level: number): void {
  this.zoomLevel = level;
  // Reset position when zooming
  this.translateX = 0;
  this.translateY = 0;
}

getTransformStyle(): string {
  return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoomLevel})`;
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


