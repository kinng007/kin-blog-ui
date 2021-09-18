import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
  forwardRef,
  OnDestroy,
  Injector,
  DoCheck,
  HostBinding,
  AfterViewInit,
  Self,
  Optional,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatFormFieldControl } from '@angular/material/form-field';
import EditorJS from '@editorjs/editorjs';
import blogTools from '../../blog-tools';

@Component({
  selector: 'mat-editorjs',
  template: ` <div
    class="blog-content-container open"
    (click)="onTouched()"
    #container
  >
    <div id="editorjs" class="blog-content open"></div>
  </div>`,
  styleUrls: ['./content-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorJsComponent),
      multi: true,
    },
    {
      provide: MatFormFieldControl,
      useExisting: EditorJsComponent,
    },
  ],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  },
})
export class EditorJsComponent
  implements
    AfterViewInit,
    DoCheck,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<any>
{
  static nextId = 0;
  @HostBinding() id = `editor-js-${EditorJsComponent.nextId++}`;
  @ViewChild('container', { read: ElementRef, static: true })
  container: ElementRef;
  stateChanges = new Subject<void>();
  editorjs: EditorJS;
  controlType = 'mat-editorjs';
  errorState = false;
  ngControl: any;
  touched = false;
  focused = false;
  private writingValue = false;

  _value: any;

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value) {
    this._value = value;
    if (!!this.editorjs && typeof this.editorjs.render === 'function') {
      this.editorjs?.render({ blocks: value });
    }

    this.onChange(value);
    this.stateChanges.next();
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  public _placeholder: string;

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  public _required = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(disabled) {
    this._disabled = coerceBooleanProperty(disabled);
    this.stateChanges.next();
  }
  public _disabled = false;

  get empty() {
    return (
      !this._value || !Array.isArray(this._value) || this._value.length == 0
    );
  }

  @Input()
  options: any = null;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  constructor(
    public elRef: ElementRef,
    public fm: FocusMonitor,
    public injector: Injector
  ) {
    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngAfterViewInit(): void {
    // avoid Cyclic Dependency
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.editorjs = new EditorJS({
      holder: 'editorjs',
      tools: blogTools,
      onChange: (api) => {
        api.saver.save().then((d) => {
          this._value = d.blocks;
          this.onChange(d.blocks);
        });
        console.info("Editor's content changed!");
      },
    });
    this.editorjs.isReady.then(
      (_) => {
        console.info('editor ready');
        if (!!this._value && this.value.length > 0) {
          this.editorjs.render({ blocks: this._value });
        }

        this.editorjs.blocks;
      },
      (err) => console.error(err)
    );
  }

  ngDoCheck(): void {
    this.touched = this.touched || this.focused;
    if (this.ngControl) {
      this.errorState = this.touched && !this.focused && this.empty;
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  writeValue(contents: any): void {
    if (!!contents) {
      this.writingValue = true;
      this._value = contents;
      if (!!this.editorjs && typeof this.editorjs.render === 'function') {
        this.editorjs.blocks.render({ blocks: contents });
      }
      this.writingValue = false;
    }
  }

  onChange = (delta: any) => {};

  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  onTouched = () => {};

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onContainerClick(event: MouseEvent) {
    if (!this.focused) {
      this.editorjs.focus();
      this.focused = true;
      this.stateChanges.next();
    }
  }
}
