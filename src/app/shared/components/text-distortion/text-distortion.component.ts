import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-text-distortion',
  templateUrl: './text-distortion.component.html',
  styleUrls: ['./text-distortion.component.scss']
})
export class TextDistortionComponent implements AfterViewInit {
  @ViewChild('textCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private text: string = "KEATON NORMILUS";
  private amplitude: number = 10; // Amplitude de la distorsion

  ngAfterViewInit(): void {
    this.setupCanvas();
    this.animate();
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error("Impossible d'obtenir le contexte 2D");
    }
    this.ctx = context;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  private distortText(x: number, y: number): number {
    return y + Math.sin((x / this.ctx.canvas.width) * 2 * Math.PI + Date.now() / 1000) * this.amplitude;
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = 'black';
    this.ctx.font = '20px Arial';
    for (let i = 0; i < this.text.length; i++) {
      const char = this.text[i];
      const posX = (this.ctx.canvas.width / this.text.length) * i;
      const posY = this.ctx.canvas.height / 2;
      this.ctx.fillText(char, posX, this.distortText(posX, posY));
    }
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.draw();
  }
}
