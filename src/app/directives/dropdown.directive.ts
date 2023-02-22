import { Directive, ElementRef, HostBinding, HostListener, Renderer2, AfterViewInit} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  // @HostBinding('class.show') isOpen = false;

  // @HostListener('click') toggleOpen() {
  //   this.isOpen = !this.isOpen;
  //   console.log(this.isOpen);
  // }
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.listen(this.el.nativeElement, 'click', (event) => {
      let dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');
      if(dropdownMenu.classList.contains('show')){
        this.renderer.removeClass(dropdownMenu, 'show');
      }else{
        this.renderer.addClass(dropdownMenu, 'show');
      }
    });
  }

  ngOnInit() {

  }


}
