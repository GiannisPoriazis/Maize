import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { NgbAlertModule, NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
	}
}

@Component({
	selector: 'datepicker',
	templateUrl: './datepicker.component.html',
	standalone: true,
	imports: [
		NgbDatepickerModule, 
		NgbAlertModule, 
		FormsModule, 
		CommonModule, 
		ReactiveFormsModule
	],
	providers: [
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	],
})
export class DatepickerComponent {
	@Input() icon?: string;
	@Input() control?: any;

	@Output() changeEvent = new EventEmitter<any>();

	dateChange(): void {
		this.changeEvent.emit();
	}
}