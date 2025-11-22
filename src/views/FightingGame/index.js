// src/views/FightingGame/index.js
import gsap from 'gsap';
import { Sprite, Fighter } from './classes';
import { rectangularCollision, determineWinner } from './utils';
import { getCharacterById } from '../../api/characterApi';

export async function startGame(playerCharacterId, enemyCharacterId) {
    const canvas = document.querySelector('canvas')
    const c = canvas.getContext('2d')

    canvas.width = 1024
    canvas.height = 576

    c.fillRect(0, 0, canvas.width, canvas.height)

    // Fetch character data from backend
    let playerData, enemyData;
    try {
        const [playerResponse, enemyResponse] = await Promise.all([
            getCharacterById(playerCharacterId),
            getCharacterById(enemyCharacterId)
        ]);
        playerData = playerResponse.data;
        enemyData = enemyResponse.data;
    } catch (error) {
        console.error('Error fetching character data:', error);
        return;
    }

    const gravity = playerData.stats?.gravity || 0.7

    const background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imageSrc: './img/background.png'
    })

    const shop = new Sprite({
        position: {
            x: 600,
            y: 128
        },
        imageSrc: './img/shop.png',
        scale: 2.75,
        framesMax: 6
    })

    // Helper to build a Fighter from backend character data
    const buildFighter = (charData, fallbackSprites = {}, initOverrides = {}) => {
        return new Fighter({
            position: initOverrides.position || charData.position || { x: 0, y: 0 },
            velocity: initOverrides.velocity || { x: 0, y: 0 },
            offset: charData.offset || { x: 0, y: 0 },
            imageSrc: charData.sprites?.idle?.imageSrc || fallbackSprites?.idle?.imageSrc || './img/Hero Knight/Sprites/Idle.png',
            framesMax: charData.sprites?.idle?.framesMax || fallbackSprites?.idle?.framesMax || 11,
            scale: charData.scale || 2.5,
            sprites: charData.sprites || fallbackSprites,
            stats: charData.stats || initOverrides.stats || { health: 100, defense: 10, speed: 5.0 },
            width: charData.width || initOverrides.width || 50,
            height: charData.height || initOverrides.height || 150
        })
    }

    let player = new Fighter({
        position: {
            x: 100,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        offset: playerData.offset || {
            x: 0,
            y: 0
        },
        imageSrc: playerData.sprites?.idle?.imageSrc || './img/Hero Knight/Sprites/Idle.png',
        framesMax: playerData.sprites?.idle?.framesMax || 11,
        scale: playerData.scale || 2.5,
        offset: playerData.offset || {
            x: 215,
            y: 135
        },
        sprites: playerData.sprites || {
            idle: {
                imageSrc: './img/Hero Knight/Sprites/Idle.png',
                framesMax: 11
            },
            run: {
                imageSrc: './img/Hero Knight/Sprites/Run.png',
                framesMax: 8
            },
            jump: {
                imageSrc: './img/Hero Knight/Sprites/Jump.png',
                framesMax: 3
            },
            fall: {
                imageSrc: './img/Hero Knight/Sprites/Fall.png',
                framesMax: 3
            },
            attack1: {
                imageSrc: './img/Hero Knight/Sprites/Attack1.png',
                framesMax: 7,
                hitFrames: [3, 4, 5],
                damage: 20,
                knockback: 12,
                attackBox: { offset: { x: 70, y: 50 }, width: 45, height: 50 }
            },
            takeHit: {
                imageSrc: './img/Hero Knight/Sprites/Take Hit.png',
                framesMax: 4
            },
            death: {
                imageSrc: './img/Hero Knight/Sprites/Death.png',
                framesMax: 11
            }
        },
        stats: playerData.stats || {
            health: 100,
            defense: 10,
            speed: 5.0
        },
        width: playerData.width || 50,
        height: playerData.height || 150
    })

    let enemy = new Fighter({
        position: {
            x: 800,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'blue',
        offset: enemyData.offset || {
            x: -50,
            y: 0
        },
        imageSrc: enemyData.sprites?.idle?.imageSrc || './img/kenji/Sprites/Idle.png',
        framesMax: enemyData.sprites?.idle?.framesMax || 4,
        scale: enemyData.scale || 2.5,
        offset: enemyData.offset || {
            x: 215,
            y: 167
        },
        sprites: enemyData.sprites || {
            idle: {
                imageSrc: './img/kenji/Sprites/Idle.png',
                framesMax: 4
            },
            run: {
                imageSrc: './img/kenji/Sprites/Run.png',
                framesMax: 8
            },
            jump: {
                imageSrc: './img/kenji/Sprites/Jump.png',
                framesMax: 2
            },
            fall: {
                imageSrc: './img/kenji/Sprites/Fall.png',
                framesMax: 2
            },
            attack1: {
                imageSrc: './img/kenji/Sprites/Attack1.png',
                framesMax: 4,
                hitFrames: [2],
                damage: 18,
                knockback: 14,
                attackBox: { offset: { x: 0, y: 50 }, width: 170, height: 50 }
            },
            takeHit: {
                imageSrc: './img/kenji/Sprites/Take hit.png',
                framesMax: 3
            },
            death: {
                imageSrc: './img/kenji/Sprites/Death.png',
                framesMax: 7
            }
        },
        stats: enemyData.stats || {
            health: 100,
            defense: 10,
            speed: 5.0
        },
        width: enemyData.width || 50,
        height: enemyData.height || 150
    })

    console.log(player)

    // Set initial facing direction
    player.facing = 1  // Player faces right
    enemy.facing = -1  // Enemy faces left

    const keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        ArrowRight: {
            pressed: false
        },
        ArrowLeft: {
            pressed: false
        }
    }

    let timer = 60
    let timerId
    let gameStarted = false
    let countdownText = '3'

    function decreaseTimer() {
        if (timer > 0) {
            timerId = setTimeout(decreaseTimer, 1000)
            timer--
            document.querySelector('#timer').innerHTML = timer
        }

        if (timer === 0) {
            determineWinner({ player, enemy, timerId })
        }
    }

    // Countdown before starting the game
    function startCountdown() {
        let count = 3
        const countdownElement = document.querySelector('#countdownText')

        if (countdownElement) {
            countdownElement.textContent = count.toString()
            countdownElement.style.display = 'block'
        }

        const countdownInterval = setInterval(() => {
            count--
            if (count > 0) {
                if (countdownElement) {
                    countdownElement.textContent = count.toString()
                }
            } else if (count === 0) {
                if (countdownElement) {
                    countdownElement.textContent = 'GO!'
                }
            } else {
                if (countdownElement) {
                    countdownElement.style.display = 'none'
                }
                gameStarted = true
                decreaseTimer()
                clearInterval(countdownInterval)
            }
        }, 1000)
    }

    startCountdown()

    // Helper to determine the hit moment for any current animation using hitFrames from sprite config
    const isHitFrame = (fighter) => {
        const currentSprite = fighter.sprites[fighter.currentAction]
        if (currentSprite) {
            // Support hitFrames array (multiple hit frames)
            if (Array.isArray(currentSprite.hitFrames)) {
                return currentSprite.hitFrames.includes(fighter.framesCurrent)
            }
            // Backward compatibility: support single hitFrame
            if (currentSprite.hitFrame !== undefined) {
                return fighter.framesCurrent === currentSprite.hitFrame
            }
        }
        // Fallback to mid-frame if hitFrame is not defined
        return fighter.framesCurrent === Math.floor(fighter.framesMax / 2)
    }

    // Transform fighter to another character by ID
    const transformFighter = async (currentFighter, transformCharacterId, role) => {
        if (!transformCharacterId) return currentFighter

        try {
            const response = await getCharacterById(transformCharacterId)
            const newData = response.data

            // Save current state
            const savedPosition = { ...currentFighter.position }
            const savedVelocity = { ...currentFighter.velocity }
            const savedFacing = currentFighter.facing
            const healthRatio = currentFighter.maxHealth ? currentFighter.health / currentFighter.maxHealth : 1

            // Fallback sprites based on role
            const fallbackSprites = role === 'player' ? {
                idle: { imageSrc: './img/Hero Knight/Sprites/Idle.png', framesMax: 11 },
                run: { imageSrc: './img/Hero Knight/Sprites/Run.png', framesMax: 8 },
                jump: { imageSrc: './img/Hero Knight/Sprites/Jump.png', framesMax: 3 },
                fall: { imageSrc: './img/Hero Knight/Sprites/Fall.png', framesMax: 3 },
                attack1: { imageSrc: './img/Hero Knight/Sprites/Attack1.png', framesMax: 7, hitFrames: [4], damage: 20, knockback: 12, attackBox: { offset: { x: 70, y: 50 }, width: 45, height: 50 } },
                takeHit: { imageSrc: './img/Hero Knight/Sprites/Take Hit.png', framesMax: 4 },
                death: { imageSrc: './img/Hero Knight/Sprites/Death.png', framesMax: 11 }
            } : {
                idle: { imageSrc: './img/kenji/Sprites/Idle.png', framesMax: 4 },
                run: { imageSrc: './img/kenji/Sprites/Run.png', framesMax: 8 },
                jump: { imageSrc: './img/kenji/Sprites/Jump.png', framesMax: 2 },
                fall: { imageSrc: './img/kenji/Sprites/Fall.png', framesMax: 2 },
                attack1: { imageSrc: './img/kenji/Sprites/Attack1.png', framesMax: 4, hitFrames: [2], damage: 18, knockback: 14, attackBox: { offset: { x: 0, y: 50 }, width: 170, height: 50 } },
                takeHit: { imageSrc: './img/kenji/Sprites/Take hit.png', framesMax: 3 },
                death: { imageSrc: './img/kenji/Sprites/Death.png', framesMax: 7 }
            }

            // Build new fighter preserving position and velocity
            const newFighter = buildFighter(newData, fallbackSprites, {
                position: savedPosition,
                velocity: savedVelocity
            })

            // Restore facing and health proportionally
            newFighter.facing = savedFacing
            newFighter.health = Math.min(newFighter.maxHealth, Math.round(newFighter.maxHealth * healthRatio))
            newFighter.hitFramesUsed = new Set()
            newFighter.currentAttack = null

            return newFighter
        } catch (error) {
            console.error('Transformation failed:', error)
            return currentFighter
        }
    }

    // Track which frames have already dealt damage in current attack
    player.hitFramesUsed = new Set()
    enemy.hitFramesUsed = new Set()

    function animate() {
        window.requestAnimationFrame(animate)
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)
        background.update(c)
        shop.update(c)
        c.fillStyle = 'rgba(255, 255, 255, 0.15)'
        c.fillRect(0, 0, canvas.width, canvas.height)
        player.update(c, canvas, gravity)
        enemy.update(c, canvas, gravity)

        // Stop game logic during countdown
        if (!gameStarted) {
            return
        }

        player.velocity.x = 0
        enemy.velocity.x = 0

        // player movement (disabled while stunned)
        if (!player.stunned) {
            if (keys.a.pressed && player.lastKey === 'a') {
                player.velocity.x = -player.speed
                player.switchSprite('run')
            } else if (keys.d.pressed && player.lastKey === 'd') {
                player.velocity.x = player.speed
                player.switchSprite('run')
            } else {
                player.switchSprite('idle')
            }
        }

        // jumping
        if (player.velocity.y < 0) {
            player.switchSprite('jump')
        } else if (player.velocity.y > 0) {
            player.switchSprite('fall')
        }

        // Enemy movement (disabled while stunned)
        if (!enemy.stunned) {
            if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
                enemy.velocity.x = -enemy.speed
                enemy.switchSprite('run')
            } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
                enemy.velocity.x = enemy.speed
                enemy.switchSprite('run')
            } else {
                enemy.switchSprite('idle')
            }
        }

        // jumping
        if (enemy.velocity.y < 0) {
            enemy.switchSprite('jump')
        } else if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall')
        }

        // detect for collision & enemy gets hit (player attacking)
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: enemy
            }) &&
            player.isAttacking &&
            isHitFrame(player) &&
            !player.hitFramesUsed.has(player.framesCurrent)
        ) {
            const dmg = player.currentAttack?.damage ?? 0
            const kb = player.currentAttack?.knockback ?? 0
            enemy.takeHit(dmg)
            // Apply horizontal knockback instantly to bypass stunned velocity lock
            enemy.position.x += kb * (player.facing || 1)
            player.hitFramesUsed.add(player.framesCurrent)

            gsap.to('#enemyHealth', {
                width: (enemy.health / enemy.maxHealth * 100) + '%'
            })
        }

        // Reset hitFramesUsed when attack animation ends
        if (player.isAttacking && player.framesCurrent === player.framesMax - 1) {
            player.isAttacking = false
            player.hitFramesUsed.clear()
            player.currentAttack = null
        }

        // this is where our player gets hit (enemy attacking)
        if (
            rectangularCollision({
                rectangle1: enemy,
                rectangle2: player
            }) &&
            enemy.isAttacking &&
            isHitFrame(enemy) &&
            !enemy.hitFramesUsed.has(enemy.framesCurrent)
        ) {
            const dmg = enemy.currentAttack?.damage ?? 0
            const kb = enemy.currentAttack?.knockback ?? 0
            player.takeHit(dmg)
            // Apply horizontal knockback instantly
            player.position.x += kb * (enemy.facing || 1)
            enemy.hitFramesUsed.add(enemy.framesCurrent)

            gsap.to('#playerHealth', {
                width: (player.health / player.maxHealth * 100) + '%'
            })
        }

        // Reset hitFramesUsed when attack animation ends
        if (enemy.isAttacking && enemy.framesCurrent === enemy.framesMax - 1) {
            enemy.isAttacking = false
            enemy.hitFramesUsed.clear()
            enemy.currentAttack = null
        }

        // end game based on health
        if (enemy.health <= 0 || player.health <= 0) {
            determineWinner({ player, enemy, timerId })
        }
    }

    animate()

    window.addEventListener('keydown', async (event) => {
        // Disable input during countdown
        if (!gameStarted) return

        if (!player.dead) {
            switch (event.key) {
                case 'd':
                    keys.d.pressed = true
                    player.lastKey = 'd'
                    break
                case 'a':
                    keys.a.pressed = true
                    player.lastKey = 'a'
                    break
                case 'w':
                    // Only allow jump if not stunned and currently grounded
                    if (!player.stunned && player.onGround) {
                        player.velocity.y = -20
                        player.onGround = false // immediately mark airborne until update() recalculates
                        console.log('Player jump')
                    }
                    break
                case ' ':
                    player.attack()
                    break
                case 'e':
                    player.attack2 && player.attack2()
                    break
                case 'f':
                    player = await transformFighter(player, playerData.transformationCharacterId, 'player')
                    break
                default:
                    break
            }
        }

        if (!enemy.dead) {
            switch (event.key) {
                case 'ArrowRight':
                    keys.ArrowRight.pressed = true
                    enemy.lastKey = 'ArrowRight'
                    break
                case 'ArrowLeft':
                    keys.ArrowLeft.pressed = true
                    enemy.lastKey = 'ArrowLeft'
                    break
                case 'ArrowUp':
                    if (!enemy.stunned && enemy.onGround) {
                        enemy.velocity.y = -20
                        enemy.onGround = false
                        console.log('Enemy jump')
                    }
                    break
                case 'ArrowDown':
                    enemy.attack()
                    break
                case 'j':
                    enemy.attack2 && enemy.attack2()
                    break
                case 'o':
                    enemy = await transformFighter(enemy, enemyData.transformationCharacterId, 'enemy')
                    break
                default:
                    break
            }
        }
    })

    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'd':
                keys.d.pressed = false
                break
            case 'a':
                keys.a.pressed = false
                break
            default:
                break
        }

        // enemy keys
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break
            default:
                break
        }
    })
}
