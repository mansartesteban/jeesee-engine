class NoiseControls {

  static amplitude = 0

  static create() {
    let container = document.createElement("div")
        container.id = "controls";

    let amplitudeSlider = document.createElement("input")
        amplitudeSlider.type = "range"

        amplitudeSlider.value = this.amplitude.toString()
    

    container.appendChild(amplitudeSlider)
    document.body.appendChild(container);
  }

  update() {

  }

}

export default NoiseControls