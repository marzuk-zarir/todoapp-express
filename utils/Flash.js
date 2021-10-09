class Flash {
    constructor(req) {
        this.req = req
        this.success = this.#extractFlashMsg('success')
        this.error = this.#extractFlashMsg('error')
        this.hasMsg = this.#hasMsg()
    }

    #extractFlashMsg(flashType) {
        const msg = this.req.flash(flashType)
        return msg.length > 0 ? msg[0] : false
    }

    #hasMsg() {
        return !!this.success || !!this.error
    }

    static getMsg(req) {
        const flash = new Flash(req)
        return {
            success: flash.success,
            error: flash.error,
            hasMsg: flash.hasMsg
        }
    }
}

module.exports = Flash
