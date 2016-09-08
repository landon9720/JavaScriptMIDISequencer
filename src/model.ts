export class Monad {
    constructor(private _inputMatrixName: string, private _operator: Operator, private _outputMidiChannel: number) {
    }
    get inputMatrixName(): string {
        return this._inputMatrixName;
    }
    get operator(): Operator {
        return this._operator;
    }
    get outputMidiChannel(): number {
        return this._outputMidiChannel;
    }
    withInputMatrixName(inputMatrixName: string) {
        return new Monad(inputMatrixName, this._operator, this._outputMidiChannel)
    }
    withOperator(operator: Operator) {
        return new Monad(this._inputMatrixName, operator, this._outputMidiChannel)
    }
    withOutputMidiChannel(outputMidiChannel: number) {
        return new Monad(this._inputMatrixName, this._operator, outputMidiChannel)
    }
}

export class Operator {

}