export interface IMessageToggle {
  toggle: {
    featureId: string;
    value: boolean;
  };
}

export interface IMessageRestart {
  restart: {
    featureId: string;
  };
}
