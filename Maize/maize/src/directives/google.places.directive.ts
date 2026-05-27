import { Directive, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[addressAutocomplete]'
})
export class GooglePlacesDirective implements OnInit {
    @Output() placeSelected = new EventEmitter<google.maps.places.PlaceResult>();

    constructor(private el: ElementRef) { }

    ngOnInit() {
        const options = {
            componentRestrictions: { country: "gr" },
            fields: ["address_components", "formatted_address", "geometry", "icon", "name"]
        };

        const autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement, options);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                this.placeSelected.emit(place);
            }
        });
    }
}