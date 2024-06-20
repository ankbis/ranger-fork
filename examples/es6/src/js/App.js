import { TweenMax } from 'gsap';
import guify from './lib/guify.min';
import ranger, { Range, parseJSON } from '../../../../dist/ranger.esm';
import BaseApp from './core/BaseApp';
import RandomPosition from "./examples/RandomPosition";
import MapPosition from "./examples/MapPosition";
import Divide from "./examples/Divide";
import Color from "./examples/Color";
import ParticleTiming from "./examples/ParticleTiming";
import Wrap from "./examples/Wrap";

export default class App extends BaseApp {

  static exampleMap = {
    'Random Position': RandomPosition,
    'Map Position': MapPosition,
    'Divide': Divide,
    'Particle Timing': ParticleTiming,
    'Color': Color,
    'Wrap': Wrap,
    'JSON Parser': JSONParserExample
  };

  static exampleKeys = Object.keys(App.exampleMap);

  state = {
    exampleKey: App.exampleKeys[0]
  };

  constructor() {
    super({
      canvas: document.querySelector('#canvas')
    });

    this.elDiscription = document.querySelector('#description');

    this.initGUI();
    this.setExample();
  }

  initGUI() {
    this.gui = new guify({
      title: 'Ranger.js',
      barMode: 'none'
    });

    this.gui.Register({
      type: 'title',
      label: 'Examples'
    });

    App.exampleKeys.forEach(key => {
      this.gui.Register({
        type: 'button',
        label: key,
        action: () => {
          this.state.exampleKey = key;
          this.setExample();
        }
      })
    });

    this.gui.Register({
      type: 'title',
      label: 'Options'
    });

    // options inserted by the example itself
  }

  update() {
    if (this.example) {
      this.example.update();
    }
  }

  setExample() {
    if (this.example) {
      this.example.destroy();
    }

    this.example = new App.exampleMap[this.state.exampleKey]({
      gui: this.gui,
      size: this.renderer.size
    });
    this.example.create();
    this.setRootNode(this.example);

    this.elDiscription.innerHTML = this.example.description;
  }
}

class JSONParserExample extends BaseExample {
  description = 'This example demonstrates the JSON parser library.';

  createGraphics() {
    const jsonString = '{"name": "John", "age": 30, "city": "New York"}';
    const parsedObject = parseJSON(jsonString);
    console.log(parsedObject);
  }

  createOptions() {
    this.createRangeInput('jsonString', 'JSON String', '', '', '');
  }

  update() {
    const parsedObject = parseJSON(this.state.jsonString);
    console.log(parsedObject);
  }
}
