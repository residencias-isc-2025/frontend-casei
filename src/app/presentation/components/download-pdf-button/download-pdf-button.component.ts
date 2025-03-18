import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-download-pdf-button',
  imports: [],
  templateUrl: './download-pdf-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadPdfButtonComponent {
  text = input('');
  buttonEmit = output();
}
