export class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
        // 1 = facing right (default), -1 = facing left
        this.facing = 1
    }

    draw(c) {
        const frameWidth = this.image.width / this.framesMax
        const dw = frameWidth * this.scale
        const dh = this.image.height * this.scale
        const drawX = this.position.x - this.offset.x
        const drawY = this.position.y - this.offset.y

        if (this.facing === -1) {
            c.save()
            c.scale(-1, 1)
            c.drawImage(
                this.image,
                this.framesCurrent * frameWidth,
                0,
                frameWidth,
                this.image.height,
                -(drawX + dw),
                drawY,
                dw,
                dh
            )
            c.restore()
        } else {
            c.drawImage(
                this.image,
                this.framesCurrent * frameWidth,
                0,
                frameWidth,
                this.image.height,
                drawX,
                drawY,
                dw,
                dh
            )
        }
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update(c) {
        this.draw(c)
        this.animateFrames()
    }
}

export class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        stats = { health: 100, defense: 10, speed: 5.0 },
        width = 50,
        height = 150
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.width = width
        this.height = height
        this.lastKey = undefined
        // Runtime active attackBox used for collision and debug draw (position gets recomputed each frame)
        // No default/base attack box; only active during an attack from sprite config
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: { x: 0, y: 0 },
            width: 0,
            height: 0
        }
        this.color = color
        this.isAttacking = false
        this.health = stats.health || 100
        this.maxHealth = stats.health || 100
        this.defense = stats.defense || 10
        this.speed = stats.speed || 5.0
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 13
        this.sprites = sprites
        this.dead = false

        // Grounded state: true when fighter is standing on ground (used to gate jumping)
        this.onGround = false

        // Debug drawing toggle (set true to visualize hitboxes and origins)
        this.debug = true

        // Track current action (idle/run/jump/fall/attack1/attack2/...)
        this.currentAction = 'idle'

        // Hit-stun flag: cannot move while true
        this.stunned = false

        // Current attack configuration (damage/knockback/attackBox) while an attack animation plays
        this.currentAttack = null

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update(c, canvas, gravity) {
        this.draw(c)
        if (!this.dead) this.animateFrames()

        // attack boxes
        // Update facing based on horizontal velocity (keep last direction when idle)
        if (this.velocity.x < 0) this.facing = -1
        else if (this.velocity.x > 0) this.facing = 1

        // Resolve active attack box definition: from current attack if provided; otherwise no active box
        const activeBoxDef = this.currentAttack?.attackBox

        // Sync runtime attackBox dims/offset to active definition (or zero it out)
        if (activeBoxDef && activeBoxDef.width && activeBoxDef.height) {
            this.attackBox.width = activeBoxDef.width
            this.attackBox.height = activeBoxDef.height
            this.attackBox.offset.x = (activeBoxDef.offset?.x ?? 0)
            this.attackBox.offset.y = (activeBoxDef.offset?.y ?? 0)
        } else {
            this.attackBox.width = 0
            this.attackBox.height = 0
            this.attackBox.offset.x = 0
            this.attackBox.offset.y = 0
        }

        if (this.facing === 1) {
            // giữ nguyên offset khi nhìn bên phải
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        } else {
            // mirror dựa theo độ rộng body & width của attackBox
            const mirroredOffsetX = (this.width - this.attackBox.width) - this.attackBox.offset.x
            this.attackBox.position.x = this.position.x + mirroredOffsetX
        }
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // draw the attack box and body hitbox for alignment when debug is on
        if (this.debug) {
            c.save()

            // Attack box (red translucent)
            c.fillStyle = 'rgba(255, 0, 0, 0.3)'
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )

            // Body hitbox (green outline)
            c.strokeStyle = 'rgba(0, 255, 0, 0.8)'
            c.lineWidth = 2
            c.strokeRect(this.position.x, this.position.y, this.width, this.height)

            // Origin point (yellow dot) at top-left of body
            c.fillStyle = 'rgba(255, 255, 0, 0.9)'
            c.beginPath()
            c.arc(this.position.x, this.position.y, 3, 0, Math.PI * 2)
            c.fill()

            c.restore()
        }

        // Prevent horizontal input-driven movement while stunned (knockback may still adjust position externally)
        if (this.stunned) this.velocity.x = 0
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity function (align bottom of body hitbox to the same ground level)
        const groundY = canvas.height - 96 // shared ground line used by the stage
        if (this.position.y + this.height + this.velocity.y >= groundY) {
            // Landing
            this.velocity.y = 0
            this.position.y = groundY - this.height
            this.onGround = true
        } else {
            // In air
            this.velocity.y += gravity
            this.onGround = false
        }

        // Release stun when takeHit animation reaches its last frame
        if (
            this.sprites.takeHit &&
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent === this.sprites.takeHit.framesMax - 1
        ) {
            this.stunned = false
        }
    }

    attack() {
        // Default/primary attack
        this.switchSprite('attack1')
        this.isAttacking = true
        this.currentAction = 'attack1'
        this._setCurrentAttackFromAction('attack1')
    }

    attack2() {
        // Secondary attack if available, otherwise fallback to attack1
        if (this.sprites.attack2 && this.sprites.attack2.image) {
            this.switchSprite('attack2')
            this.isAttacking = true
            this.currentAction = 'attack2'
            this._setCurrentAttackFromAction('attack2')
        } else {
            this.attack()
        }
    }

    takeHit(damage = 20) {
        // Cancel any ongoing attack immediately
        if (this.isAttacking) {
            this.isAttacking = false
            this.currentAttack = null
            this.currentAction = 'takeHit'
            if (this.hitFramesUsed) this.hitFramesUsed.clear()
        }

        this.health -= damage

        if (this.health <= 0) {
            // Death overrides everything
            this.isAttacking = false
            this.currentAttack = null
            this.switchSprite('death')
        } else {
            // Force takeHit sprite even if mid-attack (bypass attack guards)
            if (this.sprites.takeHit && this.image !== this.sprites.takeHit.image) {
                this.image = this.sprites.takeHit.image
                this.framesMax = this.sprites.takeHit.framesMax
                this.framesCurrent = 0
            }
            this.stunned = true
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }

        // overriding all other animations with the attack animation (unless we explicitly request takeHit or death)
        if (sprite !== 'takeHit' && sprite !== 'death') {
            if (
                this.image === this.sprites.attack1.image &&
                this.framesCurrent < this.sprites.attack1.framesMax - 1
            )
                return
            if (
                this.sprites.attack2 &&
                this.image === this.sprites.attack2.image &&
                this.framesCurrent < this.sprites.attack2.framesMax - 1
            )
                return
        }

        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'attack2':
                if (this.sprites.attack2 && this.image !== this.sprites.attack2.image) {
                    this.image = this.sprites.attack2.image
                    this.framesMax = this.sprites.attack2.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }

    // Initialize the currentAttack details using a sprite's config
    _setCurrentAttackFromAction(actionKey) {
        const spriteCfg = this.sprites[actionKey] || {}
        const cfgAttackBox = spriteCfg.attackBox
        const cfgDamage = spriteCfg.damage
        const cfgKnockback = spriteCfg.knockback

        this.currentAttack = {
            damage: typeof cfgDamage === 'number' ? cfgDamage : 0,
            knockback: typeof cfgKnockback === 'number' ? cfgKnockback : 0,
            attackBox: cfgAttackBox && cfgAttackBox.width && cfgAttackBox.height
                ? {
                    offset: {
                        x: cfgAttackBox.offset?.x ?? 0,
                        y: cfgAttackBox.offset?.y ?? 0
                    },
                    width: cfgAttackBox.width,
                    height: cfgAttackBox.height
                }
                : { offset: { x: 0, y: 0 }, width: 0, height: 0 }
        }
    }
}
