import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-download-xls-button',
  imports: [],
  templateUrl: './download-xls-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadXlsButtonComponent {
  text = input('');
  buttonEmit = output();
}
