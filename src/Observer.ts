import { _LocalObserver, IObserver } from "@types";

class Observer implements IObserver {
  observers: _LocalObserver[];
  events?: { [key: string]: string; } = {};

  constructor(events?: { [key: string]: string; }) {
    this.observers = [];
    this.events = events;
  }

  $on(events: string | string[], callback: Function): this {
    if (typeof events == "string") {
      events = [events];
    }

    events.forEach(event => {
      this.isValidEvent(event);

      this.observers.push({
        event,
        callback,
      });
    });


    return this;
  }

  unset(observer: _LocalObserver): this {
    this.observers = this.observers.filter(function (item) {
      if (item !== observer) {
        return item;
      }
    });
    return this;
  }

  $emit(event: string, ...args: any[]): this {
    this.observers
      .filter((observer: _LocalObserver) => observer.event === event)
      .forEach((observer) => {
        observer.callback(...args);
      });
    return this;
  }

  isValidEvent(event: string) {
    if (this.events) {
      if (!Object.keys(this.events).includes(event)) {
        throw new Error(`Event '${event}' is not a valid event`);
      }
    }
  }
}

export default Observer;