var Addons;
(function (Addons) {
    var CastFrame = (function () {
        function CastFrame(state) {
            var _this = this;
            this.config = {
                castSuccessColor: 0x00FF96,
                castingColor: 0xFF7D0A,
                width: 300,
                height: 30,
                x: 0,
                y: 0
            };
            this.castingUnit = null;
            this.anim = {};
            this.state = state;
            this.castingUnit = this.state.player;
            this.config.x = widthFactor * 50 - this.config.width / 2;
            this.config.y = heightFactor * 75 - this.config.height / 2;
            this.container = this.state.add.group();
            this.container.x = this.config.x;
            this.container.y = this.config.y;
            this.background = this.state.add.graphics(0, 0);
            this.background.beginFill(0x368975);
            this.background.drawRect(0, 0, this.config.width, this.config.height);
            this.cast_bar = this.state.add.graphics(0, 0);
            this.cast_bar.beginFill(0xFFFFFF);
            this.cast_bar.drawRect(0, 0, this.config.width, this.config.height);
            this.cast_bar.width = 0;
            this.cast_bar.tint = 0xFF7D0A;
            this.texture = this.state.add.sprite(0, 0, "castbar_texture2");
            this.texture.width = this.config.width;
            this.texture.height = this.config.height;
            this.texture.blendMode = PIXI.blendModes.MULTIPLY;
            this.spell_name = this.state.add.bitmapText(this.config.width / 2, this.config.height / 2, "myriad", "", 12);
            this.spell_name.anchor.set(0.5);
            this.container.addChild(this.background);
            this.container.addChild(this.cast_bar);
            this.container.addChild(this.texture);
            this.container.addChild(this.spell_name);
            this.container.alpha = 0;
            this.anim.fadeCastBar = this.state.add.tween(this.container).to({ alpha: 0 }, 1000, "Linear", false);
            this.state.events.UNIT_STARTS_SPELLCAST.add(function (s, t) { return _this.UNIT_STARTS_SPELLCAST(s, t); });
            this.state.events.UNIT_FINISH_SPELLCAST.add(function () { return _this.UNIT_FINISH_SPELLCAST(); });
        }
        CastFrame.prototype.UNIT_STARTS_SPELLCAST = function (castTime, spellName) {
            this.cast_bar.tint = this.config.castingColor;
            this.spell_name.text = spellName + ' ' + (castTime / 1000).toFixed(2) + "s";
            this.cast_bar.width = 0;
            if (this.anim.fadeCastBar.isRunning == true) {
                this.anim.fadeCastBar.reverse = true;
            }
            else
                this.container.alpha = 1;
            this.state.add.tween(this.cast_bar).to({ width: this.config.width }, castTime, "Linear", true);
        };
        CastFrame.prototype.UNIT_STOP_SPELLCAST = function (event) {
            if (event.source != this.castingUnit)
                return;
        };
        CastFrame.prototype.UNIT_FINISH_SPELLCAST = function () {
            this.cast_bar.tint = this.config.castSuccessColor;
            this.anim.fadeCastBar.reverse = false;
            this.anim.fadeCastBar.start();
        };
        return CastFrame;
    })();
    Addons.CastFrame = CastFrame;
})(Addons || (Addons = {}));
var Addons;
(function (Addons) {
    var Debug = (function () {
        function Debug(playState) {
            var _this = this;
            playState.events.GAME_LOOP_RENDER.add(function () { return _this.onRenderGame(); });
            this.player = playState.player;
        }
        Debug.prototype.onRenderGame = function () {
            game.debug.text(game.time.fps + " FPS", 20, 20, '#00FF96');
            game.debug.text("v. " + game.gameVersion, 20, 40, '#00FF96');
            game.debug.text("#### UNIT TARGET INFO ########## ", 20, 60, '#00FF96');
            if (this.player.target) {
                game.debug.text("#### Name: " + this.player.target.name, 20, 80, '#00FF96');
                game.debug.text("#### Health: " + this.player.target.getCurrentHealth(), 20, 100, '#00FF96');
                game.debug.text("#### Class: " + this.player.target.classId, 20, 120, '#00FF96');
                game.debug.text("#### Race: " + this.player.target.race, 20, 140, '#00FF96');
                game.debug.text("#### Haste_percent: " + this.player.target.total_haste() + ' %', 20, 160, '#00FF96');
                game.debug.text("#### Absorb: " + this.player.stats.absorb, 20, 180, '#00FF96');
            }
            game.debug.text("window.innerWidth: " + window.innerWidth, 20, 200, '#00FF96');
            game.debug.text("window.innerHeight: " + window.innerHeight, 20, 220, '#00FF96');
            game.debug.text("Mouse X: " + game.input.x, 20, 400, '#00FF96');
            game.debug.text("Mouse Y: " + game.input.y, 20, 420, '#00FF96');
        };
        return Debug;
    })();
    Addons.Debug = Debug;
})(Addons || (Addons = {}));
var Addons;
(function (Addons) {
    var RaidFrame = (function () {
        function RaidFrame(playState) {
            this.raid = [];
            this.unitFrameHeight = 40;
            this.unitFrameWidth = 90;
            this.spacing = 2;
            this.x = widthFactor * 50 - this.unitFrameWidth * 2;
            this.y = heightFactor * 50 - this.unitFrameHeight * 2;
            this.playState = playState;
            this.container = playState.add.group();
            this.createRaidFrame();
        }
        RaidFrame.prototype.createRaidFrame = function () {
            var playersInRaid = this.playState.raid.getPlayerList();
            console.log(this.playState.raid.getPlayerList());
            for (var g = 0; g < 4; g++) {
                for (var p = 0; p < 5; p++) {
                    var unit = playersInRaid[(g * 5) + p];
                    if (!unit)
                        break;
                    this.raid.push(new UnitFrame(this.container, this.unitFrameWidth * g + this.x, p * (this.unitFrameHeight + this.spacing) + this.y, this.unitFrameWidth, this.unitFrameHeight, unit, this.playState));
                }
            }
            for (var player = 0; player < this.raid.length; player++) {
                var unitFrame_frame = this.raid[player].container;
                game.add.tween(unitFrame_frame).to({ x: window.innerWidth / 2, y: -200 }, game.rnd.between(1200, 1500), Phaser.Easing.Elastic.Out, true, undefined, undefined, true);
            }
        };
        return RaidFrame;
    })();
    Addons.RaidFrame = RaidFrame;
})(Addons || (Addons = {}));
//* Future goal: This frame will listen for spells being used by the player and play cool animations based on that spell. Maybe even play spell sounds?
// https://cloudkidstudio.github.io/PixiParticlesEditor/# Could create a particle effect for each spell.
var SpellEffectAddon = (function () {
    function SpellEffectAddon() {
    }
    return SpellEffectAddon;
})();
var Addons;
(function (Addons) {
    var UnitFrames = (function () {
        function UnitFrames(screen) {
            var _this = this;
            this.unitFrameHeight = 50;
            this.unitFrameWidth = 300;
            this.targetFrameHeight = 50;
            this.targetFrameWidth = 300;
            this.state = screen;
            this.container = screen.add.group();
            this.interactionLayer = screen.add.sprite(0, 0, "castbar_texture");
            new UnitFrame(this.container, widthFactor * 25 - this.unitFrameWidth / 2, heightFactor * 75 - this.unitFrameHeight / 2, 300, 50, screen.player, screen);
            new TargetFrame(this.container, widthFactor * 75 - this.targetFrameWidth / 2, heightFactor * 75 - (this.targetFrameHeight / 2), 300, 50, screen.player, screen);
            this.interactionLayer.inputEnabled = true;
            this.interactionLayer.width = 300;
            this.interactionLayer.height = 50;
            this.interactionLayer.tint = 0xef342b;
            this.interactionLayer.alpha = 0;
            this.interactionLayer.blendMode = PIXI.blendModes.COLOR_DODGE;
            this.interactionLayer.x = widthFactor * 25 - this.unitFrameWidth / 2;
            this.interactionLayer.y = heightFactor * 75 - this.unitFrameHeight / 2;
            this.container.addChild(this.interactionLayer);
            this.interactionLayer.events.onInputDown.add(function () { _this.drag(); });
            this.interactionLayer.events.onInputUp.add(function () {
                _this.state.events.GAME_LOOP_UPDATE.removeAll();
                _this.interactionLayer.alpha = 0;
            });
        }
        UnitFrames.prototype.drag = function () {
            var _this = this;
            var initialMousePos = { x: this.state.input.x, y: this.state.input.y };
            var containerInitialPos = { x: this.container.x, y: this.container.y };
            this.interactionLayer.alpha = 0.5;
            this.state.events.GAME_LOOP_UPDATE.add(function () {
                _this.container.x = _this.state.input.mousePointer.x - initialMousePos.x + containerInitialPos.x;
                _this.container.y = _this.state.input.mousePointer.y - initialMousePos.y + containerInitialPos.y;
            });
        };
        return UnitFrames;
    })();
    Addons.UnitFrames = UnitFrames;
})(Addons || (Addons = {}));
var Player = (function () {
    function Player(_class, race, level, name, events) {
        this.level = 100;
        this.target = this;
        this.isCasting = false;
        this.alive = true;
        this.instance = null;
        this.gear_stats = {
            stamina: 7105,
            haste_rating: 1399
        };
        this.base_stats = {
            strenght: 0,
            agility: 0,
            stamina: 0,
            intellect: 0,
            spirit: 0,
            mastery_rating: 0,
            haste_rating: 0,
            crit_rating: 0,
        };
        this.stats = {
            health: { value: 0, max_value: 0, min_value: 0 },
            mana: { value: 0, max_value: 0, min_value: 0 },
            absorb: 0,
            haste: 0,
            crit: 0,
            spellpower: 0,
            attackpower: 0,
            mastery: 0.08,
        };
        this.events = events;
        this.race = race;
        this.name = name;
        this.classId = _class;
        this.init_base_stats();
        this.init_stats();
    }
    Player.prototype.init_base_stats = function () {
        this.base_stats.agility = data.classBaseStats(this.classId, this.level, stat_e.AGILITY) + data.raceBaseStats(this.race, stat_e.AGILITY);
        this.base_stats.stamina = data.classBaseStats(this.classId, this.level, stat_e.STAMINA) + data.raceBaseStats(this.race, stat_e.STAMINA) + this.gear_stats.stamina;
        this.base_stats.intellect = data.classBaseStats(this.classId, this.level, stat_e.INTELLECT) + data.raceBaseStats(this.race, stat_e.INTELLECT);
        this.base_stats.spirit = data.classBaseStats(this.classId, this.level, stat_e.SPIRIT) + data.raceBaseStats(this.race, stat_e.SPIRIT);
        this.base_stats.strenght = data.classBaseStats(this.classId, this.level, stat_e.STRENGHT) + data.raceBaseStats(this.race, stat_e.STRENGHT);
        this.base_stats.mastery_rating = 0;
        this.base_stats.haste_rating = this.gear_stats.haste_rating;
        this.base_stats.crit_rating = 0;
    };
    Player.prototype.init_stats = function () {
        this.stats.health.value = this.stats.health.max_value = this.base_stats.stamina * data.getHpPerStamina(this.level);
        this.stats.haste = this.base_stats.haste_rating * data.getCombatRating(combat_rating_e.RATING_MOD_HASTE_SPELL, this.level);
        this.stats.mana.value = this.stats.mana.max_value = data.getManaByClass(this.classId, this.level);
    };
    Player.prototype.avoid = function () {
    };
    Player.prototype.getSpellList = function () {
        var spellList = [];
        for (var spell in this.spells)
            spellList.push(spell);
        return spellList;
    };
    Player.prototype.recive_damage = function (dmg) {
        if (!this.alive)
            return;
        var avoided_damage = false;
        if (!avoided_damage) {
            if (this.stats.absorb > dmg.amount) {
                this.setAbsorb(-dmg.amount);
            }
            else {
                dmg.amount -= this.stats.absorb;
                this.setAbsorb(-this.stats.absorb);
                this.setHealth(this.getCurrentHealth() - dmg.amount);
            }
        }
    };
    Player.prototype.cast_spell = function (spellName) {
        if (!this.spells[spellName])
            return;
        var spell = this.spells[spellName];
        if (this.isCasting)
            this.events.UI_ERROR_MESSAGE.dispatch("Can't do that yet");
        else
            spell.use();
    };
    Player.prototype.hasAura = function (aura) {
        return false;
    };
    Player.prototype.resistance = function (dmg) {
        return 0;
    };
    Player.prototype.die = function () {
        this.alive = false;
    };
    Player.prototype.getAbsorb = function () {
        return this.stats.absorb;
    };
    Player.prototype.setHealth = function (value) {
        if (!this.alive)
            return;
        if (value <= 0) {
            this.stats.health.value = 0;
            this.alive = false;
            this.events.UNIT_DEATH.dispatch({ unit: this });
            return;
        }
        if (value >= this.getMaxHealth()) {
            this.stats.health.value = this.getMaxHealth();
        }
        else {
            this.stats.health.value = value;
        }
        this.events.UNIT_HEALTH_CHANGE.dispatch(this);
    };
    Player.prototype.setAbsorb = function (value) {
        if (!this.alive)
            return;
        this.stats.absorb += value;
        this.events.UNIT_ABSORB.dispatch(this);
    };
    Player.prototype.getMaxHealth = function () {
        return this.stats.health.max_value;
    };
    Player.prototype.getCurrentHealth = function () {
        return this.stats.health.value;
    };
    Player.prototype.setTarget = function (unit) {
        if (unit == this.target) {
            return;
        }
        this.target = unit;
        this.events.TARGET_CHANGE_EVENT.dispatch();
    };
    Player.prototype.consume_resource = function (resource, amount) {
    };
    Player.prototype.total_haste = function () {
        return this.stats.haste;
    };
    return Player;
})();
//* Base spell class that all spells extends upon //
var SpellBase = (function () {
    function SpellBase(spelldata, player) {
        this.onCooldown = false;
        this.hasCooldown = false;
        this.hasPowerCost = false;
        this.isInstant = false;
        this.player = player;
        this.powerType = spelldata.resourceType;
        this.school = spelldata.school;
        this.name = spelldata.name;
        this.spellid = spelldata.id;
        this.base_casttime = spelldata.casttime;
        this.base_cooldown = spelldata.cooldown;
        if (this.base_cooldown > 0)
            this.hasCooldown = true;
        if (this.powerCost > 0)
            this.hasPowerCost = true;
        if (this.base_casttime == 0)
            this.isInstant = true;
    }
    SpellBase.prototype.use = function () {
        this.target = this.player.target;
        if (!this.can_use()) {
            return;
        }
        if (this.isInstant)
            this.execute();
        else
            this.start_casting();
    };
    SpellBase.prototype.execute = function () {
        this.consumeResource();
        if (this.hasCooldown)
            this.start_cooldown();
    };
    SpellBase.prototype.start_casting = function () {
        var _this = this;
        this.player.isCasting = true;
        var ct = this.cast_time();
        this.current_cast = game.time.events.add(ct, function () { return _this.cast_finished(); });
        this.player.events.UNIT_STARTS_SPELLCAST.dispatch(ct, this.name);
    };
    SpellBase.prototype.start_cooldown = function () {
        var _this = this;
        this.onCooldown = true;
        var cd = this.cooldown();
        this.current_cooldown = game.time.events.add(cd, function () { return _this.onCooldownReady(); });
        this.player.events.ON_COOLDOWN_START.dispatch({ cooldownLenght: cd, spellid: this.spellid });
    };
    SpellBase.prototype.can_use = function () {
        if (this.onCooldown) {
            return false;
        }
        return true;
    };
    SpellBase.prototype.cast_finished = function () {
        this.player.isCasting = false;
        this.player.events.UNIT_FINISH_SPELLCAST.dispatch();
        this.execute();
    };
    SpellBase.prototype.cast_time = function () {
        return this.base_casttime * (1 - (this.player.total_haste() / 100));
    };
    SpellBase.prototype.cancel_cast = function () {
        game.time.events.remove(this.current_cast);
    };
    SpellBase.prototype.consumeResource = function () {
        if (!this.hasPowerCost)
            return;
        this.player.consume_resource(this.powerType, this.powerCost);
    };
    SpellBase.prototype.onCooldownReady = function () {
        this.onCooldown = false;
        this.player.events.ON_COOLDOWN_ENDED.dispatch({ spellid: this.spellid });
    };
    SpellBase.prototype.cooldown = function () {
        return this.base_cooldown;
    };
    SpellBase.prototype.cost = function () {
        return this.powerCost;
    };
    return SpellBase;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path='../player.ts' />
///<reference path='../spell_base.ts' />
var Priest;
(function (Priest_1) {
    var Priest = (function (_super) {
        __extends(Priest, _super);
        function Priest(race, level, name, eventManager) {
            _super.call(this, class_e.PRIEST, race, level, name, eventManager);
            this.init_spells();
        }
        Priest.prototype.init_spells = function () {
            this.spells = {
                power_word_shield: new power_word_shield(this),
                flash_of_light: new flash_of_light(this),
                clarity_of_will: new clarity_of_will(this),
                power_infusion: new power_infusion(this)
            };
        };
        return Priest;
    })(Player);
    Priest_1.Priest = Priest;
    var flash_of_light = (function (_super) {
        __extends(flash_of_light, _super);
        function flash_of_light(player) {
            _super.call(this, data.getSpellData('flash_of_light'), player);
        }
        flash_of_light.prototype.cast_time = function () {
            var ct = _super.prototype.cast_time.call(this);
            if (this.target.hasAura("tidal_waves")) {
                ct *= 2;
            }
            return ct;
        };
        flash_of_light.prototype.execute = function () {
            _super.prototype.execute.call(this);
            var crit = game.rnd.between(1, 2);
            this.target.setHealth(this.target.getCurrentHealth() + 110000 * crit);
        };
        return flash_of_light;
    })(SpellBase);
    var power_word_shield = (function (_super) {
        __extends(power_word_shield, _super);
        function power_word_shield(player) {
            _super.call(this, data.getSpellData('power_word_shield'), player);
        }
        power_word_shield.prototype.can_use = function () {
            if (this.target.hasAura("weakened_soul"))
                return false;
            else
                return _super.prototype.can_use.call(this);
        };
        power_word_shield.prototype.execute = function () {
            _super.prototype.execute.call(this);
            var crit = game.rnd.between(1, 2);
            this.target.setAbsorb(90000 * crit);
        };
        return power_word_shield;
    })(SpellBase);
    var power_infusion = (function (_super) {
        __extends(power_infusion, _super);
        function power_infusion(player) {
            _super.call(this, data.getSpellData('power_infusion'), player);
        }
        power_infusion.prototype.execute = function () {
            _super.prototype.execute.call(this);
            this.player.stats.haste += 15;
        };
        return power_infusion;
    })(SpellBase);
    var clarity_of_will = (function (_super) {
        __extends(clarity_of_will, _super);
        function clarity_of_will(player) {
            _super.call(this, data.getSpellData('clarity_of_will'), player);
        }
        clarity_of_will.prototype.execute = function () {
            _super.prototype.execute.call(this);
            var crit = game.rnd.between(1, 2);
            this.target.setAbsorb(110000 * crit);
        };
        return clarity_of_will;
    })(SpellBase);
})(Priest || (Priest = {}));
var stat_e;
(function (stat_e) {
    stat_e[stat_e["STRENGHT"] = 0] = "STRENGHT";
    stat_e[stat_e["AGILITY"] = 1] = "AGILITY";
    stat_e[stat_e["STAMINA"] = 2] = "STAMINA";
    stat_e[stat_e["INTELLECT"] = 3] = "INTELLECT";
    stat_e[stat_e["SPIRIT"] = 4] = "SPIRIT";
})(stat_e || (stat_e = {}));
;
var class_e;
(function (class_e) {
    class_e[class_e["WARRIOR"] = 0] = "WARRIOR";
    class_e[class_e["PALADIN"] = 1] = "PALADIN";
    class_e[class_e["HUNTER"] = 2] = "HUNTER";
    class_e[class_e["ROGUE"] = 3] = "ROGUE";
    class_e[class_e["PRIEST"] = 4] = "PRIEST";
    class_e[class_e["DEATHKNIGHT"] = 5] = "DEATHKNIGHT";
    class_e[class_e["SHAMAN"] = 6] = "SHAMAN";
    class_e[class_e["MAGE"] = 7] = "MAGE";
    class_e[class_e["WARLOCK"] = 8] = "WARLOCK";
    class_e[class_e["MONK"] = 9] = "MONK";
    class_e[class_e["DRUID"] = 10] = "DRUID";
})(class_e || (class_e = {}));
;
var race_e;
(function (race_e) {
    race_e[race_e["RACE_NONE"] = 0] = "RACE_NONE";
    race_e[race_e["RACE_BEAST"] = 1] = "RACE_BEAST";
    race_e[race_e["RACE_DRAGONKIN"] = 2] = "RACE_DRAGONKIN";
    race_e[race_e["RACE_GIANT"] = 3] = "RACE_GIANT";
    race_e[race_e["RACE_HUMANOID"] = 4] = "RACE_HUMANOID";
    race_e[race_e["RACE_DEMON"] = 5] = "RACE_DEMON";
    race_e[race_e["RACE_ELEMENTAL"] = 6] = "RACE_ELEMENTAL";
    race_e[race_e["RACE_NIGHT_ELF"] = 7] = "RACE_NIGHT_ELF";
    race_e[race_e["RACE_HUMAN"] = 8] = "RACE_HUMAN";
    race_e[race_e["RACE_GNOME"] = 9] = "RACE_GNOME";
    race_e[race_e["RACE_DWARF"] = 10] = "RACE_DWARF";
    race_e[race_e["RACE_DRAENEI"] = 11] = "RACE_DRAENEI";
    race_e[race_e["RACE_WORGEN"] = 12] = "RACE_WORGEN";
    race_e[race_e["RACE_ORC"] = 13] = "RACE_ORC";
    race_e[race_e["RACE_TROLL"] = 14] = "RACE_TROLL";
    race_e[race_e["RACE_UNDEAD"] = 15] = "RACE_UNDEAD";
    race_e[race_e["RACE_BLOOD_ELF"] = 16] = "RACE_BLOOD_ELF";
    race_e[race_e["RACE_TAUREN"] = 17] = "RACE_TAUREN";
    race_e[race_e["RACE_GOBLIN"] = 18] = "RACE_GOBLIN";
    race_e[race_e["RACE_PANDAREN"] = 19] = "RACE_PANDAREN";
    race_e[race_e["RACE_PANDAREN_ALLIANCE"] = 20] = "RACE_PANDAREN_ALLIANCE";
    race_e[race_e["RACE_PANDAREN_HORDE"] = 21] = "RACE_PANDAREN_HORDE";
    race_e[race_e["RACE_MAX"] = 22] = "RACE_MAX";
    race_e[race_e["RACE_UNKNOWN"] = 23] = "RACE_UNKNOWN";
})(race_e || (race_e = {}));
;
var combat_rating_e;
(function (combat_rating_e) {
    combat_rating_e[combat_rating_e["RATING_MOD_DODGE"] = 0] = "RATING_MOD_DODGE";
    combat_rating_e[combat_rating_e["RATING_MOD_PARRY"] = 1] = "RATING_MOD_PARRY";
    combat_rating_e[combat_rating_e["RATING_MOD_HIT_MELEE"] = 2] = "RATING_MOD_HIT_MELEE";
    combat_rating_e[combat_rating_e["RATING_MOD_HIT_RANGED"] = 3] = "RATING_MOD_HIT_RANGED";
    combat_rating_e[combat_rating_e["RATING_MOD_HIT_SPELL"] = 4] = "RATING_MOD_HIT_SPELL";
    combat_rating_e[combat_rating_e["RATING_MOD_CRIT_MELEE"] = 5] = "RATING_MOD_CRIT_MELEE";
    combat_rating_e[combat_rating_e["RATING_MOD_CRIT_RANGED"] = 6] = "RATING_MOD_CRIT_RANGED";
    combat_rating_e[combat_rating_e["RATING_MOD_CRIT_SPELL"] = 7] = "RATING_MOD_CRIT_SPELL";
    combat_rating_e[combat_rating_e["RATING_MOD_MULTISTRIKE"] = 8] = "RATING_MOD_MULTISTRIKE";
    combat_rating_e[combat_rating_e["RATING_MOD_READINESS"] = 9] = "RATING_MOD_READINESS";
    combat_rating_e[combat_rating_e["RATING_MOD_SPEED"] = 10] = "RATING_MOD_SPEED";
    combat_rating_e[combat_rating_e["RATING_MOD_RESILIENCE"] = 11] = "RATING_MOD_RESILIENCE";
    combat_rating_e[combat_rating_e["RATING_MOD_LEECH"] = 12] = "RATING_MOD_LEECH";
    combat_rating_e[combat_rating_e["RATING_MOD_HASTE_MELEE"] = 13] = "RATING_MOD_HASTE_MELEE";
    combat_rating_e[combat_rating_e["RATING_MOD_HASTE_RANGED"] = 14] = "RATING_MOD_HASTE_RANGED";
    combat_rating_e[combat_rating_e["RATING_MOD_HASTE_SPELL"] = 15] = "RATING_MOD_HASTE_SPELL";
    combat_rating_e[combat_rating_e["RATING_MOD_EXPERTISE"] = 16] = "RATING_MOD_EXPERTISE";
    combat_rating_e[combat_rating_e["RATING_MOD_MASTERY"] = 17] = "RATING_MOD_MASTERY";
    combat_rating_e[combat_rating_e["RATING_MOD_PVP_POWER"] = 18] = "RATING_MOD_PVP_POWER";
    combat_rating_e[combat_rating_e["RATING_MOD_VERS_DAMAGE"] = 19] = "RATING_MOD_VERS_DAMAGE";
    combat_rating_e[combat_rating_e["RATING_MOD_VERS_HEAL"] = 20] = "RATING_MOD_VERS_HEAL";
    combat_rating_e[combat_rating_e["RATING_MOD_VERS_MITIG"] = 21] = "RATING_MOD_VERS_MITIG";
})(combat_rating_e || (combat_rating_e = {}));
;
var player_level;
(function (player_level) {
    player_level[player_level["MIN"] = 1] = "MIN";
    player_level[player_level["MAX"] = 100] = "MAX";
    player_level[player_level["DEFAULT"] = 100] = "DEFAULT";
})(player_level || (player_level = {}));
;
var player_race;
(function (player_race) {
    player_race[player_race["MIN"] = 7] = "MIN";
    player_race[player_race["MAX"] = 21] = "MAX";
})(player_race || (player_race = {}));
;
var player_class;
(function (player_class) {
    player_class[player_class["MIN"] = 0] = "MIN";
    player_class[player_class["MAX"] = 10] = "MAX";
})(player_class || (player_class = {}));
;
var AddonManager = (function () {
    function AddonManager() {
        this.addons = {};
    }
    AddonManager.prototype.add = function (addonKey, addonCode) {
        this.addons[addonKey] = { name: addonKey, enabled: true, code: addonCode };
    };
    AddonManager.prototype.disableAddon = function (addonKey) {
        if (!this.addons[addonKey])
            return;
        else
            this.addons[addonKey].enabled = false;
    };
    AddonManager.prototype.enableAddon = function (addonKey) {
        if (!this.addons[addonKey])
            return;
        else
            this.addons[addonKey].enabled = true;
    };
    AddonManager.prototype.getListOfAddons = function () {
        var addonList = [];
        for (var addon in this.addons) {
            var currentAddon = this.addons[addon];
            addonList.push([currentAddon.name, currentAddon.enabled]);
        }
        return addonList;
    };
    AddonManager.prototype.loadEnabledAddons = function (stateToDrawTo) {
        for (var addon in this.addons) {
            var currentAddon = this.addons[addon];
            if (currentAddon.enabled)
                new currentAddon.code(stateToDrawTo);
        }
    };
    return AddonManager;
})();
var data;
(function (data) {
    function getArmoryData(name, realm) {
        if (name === void 0) { name = 'Blome'; }
        if (realm === void 0) { realm = 'the-maelstrom'; }
        var blizz_api_url = "https://eu.api.battle.net";
        var api_key = 'fhmzgc7qd2ypwdg87t2j8nuv6pxcbftb';
    }
    function classBaseStats(_class, level, stat) {
        return class_base_stats_by_level[_class + 1][level - 1][stat];
    }
    data.classBaseStats = classBaseStats;
    function getKeyBindings() {
        return keybindings;
    }
    data.getKeyBindings = getKeyBindings;
    ;
    function raceBaseStats(race, stat) {
        return race_base_stats[race][stat];
    }
    data.raceBaseStats = raceBaseStats;
    function getHpPerStamina(level) {
        return hp_per_stamina[level - 1];
    }
    data.getHpPerStamina = getHpPerStamina;
    function getCombatRating(rating, level) {
        return (1 / combat_rating_multipliers[rating][level - 1]);
    }
    data.getCombatRating = getCombatRating;
    function getManaByClass(_class, level) {
        return mana_by_class[_class + 1][level - 1];
    }
    data.getManaByClass = getManaByClass;
    function getSpellData(spell) {
        return spelldata[spell];
    }
    data.getSpellData = getSpellData;
    function getClassColor(classId) {
        var classColors = [0xC79C6E, 0xF58CBA, 0xABD473, 0xFFF569, 0xFFFFFF, 0xC41F3B, 0x0070DE, 0x69CCF0, 0x9482C9, 0x00FF96, 0xFF7D0A];
        return classColors[classId] || classColors[1];
    }
    data.getClassColor = getClassColor;
    function generatePlayerName() {
        var nameList = "Eowiragan,Ferraseth,Umeilith,Wice,Brierid,Fedriric,Higod,Gweann,Thigovudd,Fraliwyr,Zardorin,Halrik,Qae,Gwoif,Zoican,Tjolme,Dalibwyn,Miram,Medon,Aseannor,Angleus,Seita,Sejta,Fraggoji,Verdisha,Oixte,Lazeil,Jhazrun,Kahva,Ussos,Usso,Neverknow,Sco,Treckie,Slootbag,Unpl,Smirk,Lappe,Fraggoboss,Devai,Luumu,Alzu,Altzu";
        var nameArray = nameList.split(",");
        return nameArray[game.rnd.between(0, nameArray.length - 1)];
    }
    data.generatePlayerName = generatePlayerName;
    function findMostInjuredPlayers(players) {
        var playersInRange = this.instance.getPlayerList();
        var lowestPlayers = playersInRange.sort(function sortByDamageTakenAscending(player, otherPlayer) {
            if (player.getHealthPercent() < otherPlayer.getHealthPercent()) {
                return -1;
            }
            else if (player.getHealthPercent() > otherPlayer.getHealthPercent()) {
                return 1;
            }
            else {
                return 0;
            }
        });
        return lowestPlayers.slice(0, players);
    }
    data.findMostInjuredPlayers = findMostInjuredPlayers;
    var keybindings = {
        ACTION_BUTTON_1: { key: '1', spell: 'flash_of_light' },
        ACTION_BUTTON_2: { key: '2', spell: 'power_word_shield' },
        ACTION_BUTTON_3: { key: '3', spell: 'clarity_of_will' },
        ACTION_BUTTON_4: { key: '4', spell: 'power_infusion' }
    };
    var spelldata = {
        flash_of_light: {
            casttime: 1500,
            resource_cost: 10,
            resource_type: "mana",
            cooldown: 0,
            name: 'Flash Of Light',
            id: 1
        },
        power_infusion: {
            casttime: 0,
            resource_cost: 10,
            resource_type: "mana",
            cooldown: 30000,
            name: 'Power Infusion',
            id: 2
        },
        healing_surge: {
            casttime: 1500,
            resource_cost: 10,
            resource_type: "mana",
            cooldown: 0,
            name: 'Flash Of Light',
            id: 3
        },
        chain_heal: {
            casttime: 1620,
            resource_cost: 10,
            resource_type: "mana",
            cooldown: 0,
            name: 'Chain Heal',
            id: 4
        },
        power_word_shield: {
            casttime: 0,
            resource_cost: 10,
            resource_type: "mana",
            cooldown: 4000,
            name: 'Power Word Shield',
            id: 5
        },
        clarity_of_will: {
            casttime: 2500,
            resource_cost: 10,
            resource_type: "mana",
            cooldown: 0,
            name: 'Clarity Of Will',
            id: 6
        }
    };
    var combat_rating_multipliers = [
        [
            0.796153187751770, 0.796153068542480, 0.796153068542480, 0.796153068542480, 0.796152949333191,
            0.796153128147125, 0.796153068542480, 0.796153008937836, 0.796153008937836, 0.796153128147125,
            1.194230556488037, 1.592308163642883, 1.990383744239807, 2.388461112976074, 2.786539077758789,
            3.184616804122925, 3.582691907882690, 3.980769872665405, 4.378847599029541, 4.776922702789307,
            5.175000190734863, 5.573077678680420, 5.971153259277344, 6.369230747222900, 6.767308712005615,
            7.165383338928223, 7.563461780548096, 7.961538791656494, 8.359617233276367, 8.757692337036133,
            9.155768394470215, 9.553846359252930, 9.951925277709961, 10.350001335144043, 10.748077392578125,
            11.146153450012207, 11.544231414794922, 11.942307472229004, 12.340383529663086, 12.738462448120117,
            13.136537551879883, 13.534616470336914, 13.932692527770996, 14.330768585205078, 14.728846549987793,
            15.126925468444824, 15.524999618530273, 15.923077583312988, 16.321155548095703, 16.719230651855469,
            17.117309570312500, 17.515386581420898, 17.913461685180664, 18.311538696289062, 18.709617614746094,
            19.107692718505859, 19.505769729614258, 19.903848648071289, 20.301923751831055, 20.700000762939453,
            20.924497604370117, 21.198993682861328, 21.473491668701172, 21.747989654541016, 22.022485733032227,
            22.296983718872070, 22.571481704711914, 22.845977783203125, 23.120475769042969, 23.394973754882812,
            23.669469833374023, 23.943967819213867, 24.218465805053711, 24.492961883544922, 24.767459869384766,
            25.041955947875977, 25.316453933715820, 25.590951919555664, 25.865447998046875, 26.139945983886719,
            27.206882476806641, 28.273818969726562, 28.807287216186523, 28.807287216186523, 29.340755462646484,
            30.407691955566406, 31.474628448486328, 32.541564941406250, 33.608501434326172, 34.000000000000000,
            40.000000000000000, 47.000000000000000, 56.000000000000000, 65.000000000000000, 75.000000000000000,
            89.000000000000000, 103.000000000000000, 121.000000000000000, 140.000000000000000, 162.000000000000000,
            162.000000000000000, 162.000000000000000, 162.000000000000000, 162.000000000000000, 162.000000000000000,
        ],
        [
            0.796153187751770, 0.796153068542480, 0.796153068542480, 0.796153068542480, 0.796152949333191,
            0.796153128147125, 0.796153068542480, 0.796153008937836, 0.796153008937836, 0.796153128147125,
            1.194230556488037, 1.592308163642883, 1.990383744239807, 2.388461112976074, 2.786539077758789,
            3.184616804122925, 3.582691907882690, 3.980769872665405, 4.378847599029541, 4.776922702789307,
            5.175000190734863, 5.573077678680420, 5.971153259277344, 6.369230747222900, 6.767308712005615,
            7.165383338928223, 7.563461780548096, 7.961538791656494, 8.359617233276367, 8.757692337036133,
            9.155768394470215, 9.553846359252930, 9.951925277709961, 10.350001335144043, 10.748077392578125,
            11.146153450012207, 11.544231414794922, 11.942307472229004, 12.340383529663086, 12.738462448120117,
            13.136537551879883, 13.534616470336914, 13.932692527770996, 14.330768585205078, 14.728846549987793,
            15.126925468444824, 15.524999618530273, 15.923077583312988, 16.321155548095703, 16.719230651855469,
            17.117309570312500, 17.515386581420898, 17.913461685180664, 18.311538696289062, 18.709617614746094,
            19.107692718505859, 19.505769729614258, 19.903848648071289, 20.301923751831055, 20.700000762939453,
            20.924497604370117, 21.198993682861328, 21.473491668701172, 21.747989654541016, 22.022485733032227,
            22.296983718872070, 22.571481704711914, 22.845977783203125, 23.120475769042969, 23.394973754882812,
            23.669469833374023, 23.943967819213867, 24.218465805053711, 24.492961883544922, 24.767459869384766,
            25.041955947875977, 25.316453933715820, 25.590951919555664, 25.865447998046875, 26.139945983886719,
            27.206882476806641, 28.273818969726562, 28.807287216186523, 28.807287216186523, 29.340755462646484,
            30.407691955566406, 31.474628448486328, 32.541564941406250, 33.608501434326172, 34.000000000000000,
            40.000000000000000, 47.000000000000000, 56.000000000000000, 65.000000000000000, 75.000000000000000,
            89.000000000000000, 103.000000000000000, 121.000000000000000, 140.000000000000000, 162.000000000000000,
            162.000000000000000, 162.000000000000000, 162.000000000000000, 162.000000000000000, 162.000000000000000,
        ],
        [
            0.265384346246719, 0.265384316444397, 0.265384316444397, 0.265384346246719, 0.265384316444397,
            0.265384346246719, 0.265384376049042, 0.265384346246719, 0.265384376049042, 0.265384376049042,
            0.398076862096786, 0.530769407749176, 0.663461208343506, 0.796153724193573, 0.928846478462219,
            1.061538696289062, 1.194230675697327, 1.326923012733459, 1.459615826606750, 1.592307567596436,
            1.724999904632568, 1.857692241668701, 1.990384459495544, 2.123076915740967, 2.255769252777100,
            2.388461112976074, 2.521154165267944, 2.653846025466919, 2.786538839340210, 2.919230461120605,
            3.051922798156738, 3.184615373611450, 3.317308425903320, 3.450000047683716, 3.582691907882690,
            3.715384006500244, 3.848077058792114, 3.980768918991089, 4.113461017608643, 4.246153831481934,
            4.378846168518066, 4.511538982391357, 4.644230842590332, 4.776923179626465, 4.909615993499756,
            5.042307853698730, 5.175000190734863, 5.307693004608154, 5.440383911132812, 5.573077201843262,
            5.705769062042236, 5.838461875915527, 5.971154212951660, 6.103846073150635, 6.236537933349609,
            6.369231224060059, 6.501923084259033, 6.634614944458008, 6.767308235168457, 6.900001049041748,
            6.974832534790039, 7.066331386566162, 7.157830715179443, 7.249329566955566, 7.340828895568848,
            7.432327747344971, 7.523827075958252, 7.615325927734375, 7.706825256347656, 7.798324108123779,
            7.889823436737061, 7.981322765350342, 8.072821617126465, 8.164320945739746, 8.255820274353027,
            8.347318649291992, 8.438817977905273, 8.530317306518555, 8.621816635131836, 8.713315010070801,
            9.068961143493652, 9.424606323242188, 9.602429389953613, 9.602429389953613, 9.780251502990723,
            10.135897636413574, 10.491542816162109, 10.847188949584961, 11.202834129333496, 11.000000000000000,
            13.000000000000000, 16.000000000000000, 19.000000000000000, 22.000000000000000, 25.000000000000000,
            30.000000000000000, 34.000000000000000, 40.000000000000000, 47.000000000000000, 54.000000000000000,
            54.000000000000000, 54.000000000000000, 54.000000000000000, 54.000000000000000, 54.000000000000000,
        ],
        [
            0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193,
            0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193,
            0.461537986993790, 0.615384995937347, 0.769231021404266, 0.923076987266541, 1.076923012733459,
            1.230769038200378, 1.384614944458008, 1.538462042808533, 1.692307949066162, 1.846153974533081,
            2.000000000000000, 2.153846025466919, 2.307692050933838, 2.461539030075073, 2.615385055541992,
            2.769231081008911, 2.923077106475830, 3.076922893524170, 3.230768918991089, 3.384614944458008,
            3.538461923599243, 3.692307949066162, 3.846153974533081, 4.000000000000000, 4.153845787048340,
            4.307692050933838, 4.461537837982178, 4.615385055541992, 4.769230842590332, 4.923077106475830,
            5.076922893524170, 5.230769157409668, 5.384614944458008, 5.538462162017822, 5.692306995391846,
            5.846154212951660, 6.000000000000000, 6.153845787048340, 6.307693004608154, 6.461537837982178,
            6.615385055541992, 6.769230842590332, 6.923077106475830, 7.076922893524170, 7.230769157409668,
            7.384614944458008, 7.538462162017822, 7.692306995391846, 7.846154212951660, 8.000000000000000,
            8.038789749145508, 8.144246101379395, 8.249703407287598, 8.355159759521484, 8.460616111755371,
            8.566072463989258, 8.671529769897461, 8.776986122131348, 8.882442474365234, 8.987898826599121,
            9.093356132507324, 9.198812484741211, 9.304268836975098, 9.409725189208984, 9.515182495117188,
            9.620638847351074, 9.726095199584961, 9.831551551818848, 9.937008857727051, 10.042465209960938,
            10.452362060546875, 10.862257957458496, 11.067206382751465, 11.067206382751465, 11.272154808044434,
            11.682051658630371, 12.091947555541992, 12.501844406127930, 12.911741256713867, 13.000000000000000,
            15.000000000000000, 18.000000000000000, 22.000000000000000, 25.000000000000000, 29.000000000000000,
            34.000000000000000, 40.000000000000000, 46.000000000000000, 54.000000000000000, 62.000000000000000,
            62.000000000000000, 62.000000000000000, 62.000000000000000, 62.000000000000000, 62.000000000000000,
        ],
        [
            0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193,
            0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193,
            0.461537986993790, 0.615384995937347, 0.769231021404266, 0.923076987266541, 1.076923012733459,
            1.230769038200378, 1.384614944458008, 1.538462042808533, 1.692307949066162, 1.846153974533081,
            2.000000000000000, 2.153846025466919, 2.307692050933838, 2.461539030075073, 2.615385055541992,
            2.769231081008911, 2.923077106475830, 3.076922893524170, 3.230768918991089, 3.384614944458008,
            3.538461923599243, 3.692307949066162, 3.846153974533081, 4.000000000000000, 4.153845787048340,
            4.307692050933838, 4.461537837982178, 4.615385055541992, 4.769230842590332, 4.923077106475830,
            5.076922893524170, 5.230769157409668, 5.384614944458008, 5.538462162017822, 5.692306995391846,
            5.846154212951660, 6.000000000000000, 6.153845787048340, 6.307693004608154, 6.461537837982178,
            6.615385055541992, 6.769230842590332, 6.923077106475830, 7.076922893524170, 7.230769157409668,
            7.384614944458008, 7.538462162017822, 7.692306995391846, 7.846154212951660, 8.000000000000000,
            8.038789749145508, 8.144246101379395, 8.249703407287598, 8.355159759521484, 8.460616111755371,
            8.566072463989258, 8.671529769897461, 8.776986122131348, 8.882442474365234, 8.987898826599121,
            9.093356132507324, 9.198812484741211, 9.304268836975098, 9.409725189208984, 9.515182495117188,
            9.620638847351074, 9.726095199584961, 9.831551551818848, 9.937008857727051, 10.042465209960938,
            10.452362060546875, 10.862257957458496, 11.067206382751465, 11.067206382751465, 11.272154808044434,
            11.682051658630371, 12.091947555541992, 12.501844406127930, 12.911741256713867, 13.000000000000000,
            15.000000000000000, 18.000000000000000, 22.000000000000000, 25.000000000000000, 29.000000000000000,
            34.000000000000000, 40.000000000000000, 46.000000000000000, 54.000000000000000, 62.000000000000000,
            62.000000000000000, 62.000000000000000, 62.000000000000000, 62.000000000000000, 62.000000000000000,
        ],
        [
            0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193,
            0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193,
            0.461537986993790, 0.615384995937347, 0.769231021404266, 0.923076987266541, 1.076923012733459,
            1.230769038200378, 1.384614944458008, 1.538462042808533, 1.692307949066162, 1.846153974533081,
            2.000000000000000, 2.153846025466919, 2.307692050933838, 2.461539030075073, 2.615385055541992,
            2.769231081008911, 2.923077106475830, 3.076922893524170, 3.230768918991089, 3.384614944458008,
            3.538461923599243, 3.692307949066162, 3.846153974533081, 4.000000000000000, 4.153845787048340,
            4.307692050933838, 4.461537837982178, 4.615385055541992, 4.769230842590332, 4.923077106475830,
            5.076922893524170, 5.230769157409668, 5.384614944458008, 5.538462162017822, 5.692306995391846,
            5.846154212951660, 6.000000000000000, 6.153845787048340, 6.307693004608154, 6.461537837982178,
            6.615385055541992, 6.769230842590332, 6.923077106475830, 7.076922893524170, 7.230769157409668,
            7.384614944458008, 7.538462162017822, 7.692306995391846, 7.846154212951660, 8.000000000000000,
            8.038789749145508, 8.144246101379395, 8.249703407287598, 8.355159759521484, 8.460616111755371,
            8.566072463989258, 8.671529769897461, 8.776986122131348, 8.882442474365234, 8.987898826599121,
            9.093356132507324, 9.198812484741211, 9.304268836975098, 9.409725189208984, 9.515182495117188,
            9.620638847351074, 9.726095199584961, 9.831551551818848, 9.937008857727051, 10.042465209960938,
            10.452362060546875, 10.862257957458496, 11.067206382751465, 11.067206382751465, 11.272154808044434,
            11.682051658630371, 12.091947555541992, 12.501844406127930, 12.911741256713867, 13.000000000000000,
            15.000000000000000, 18.000000000000000, 22.000000000000000, 25.000000000000000, 29.000000000000000,
            34.000000000000000, 40.000000000000000, 46.000000000000000, 54.000000000000000, 62.000000000000000,
            62.000000000000000, 62.000000000000000, 62.000000000000000, 62.000000000000000, 62.000000000000000,
        ],
        [
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.807691991329193, 1.076923012733459, 1.346153974533081, 1.615385055541992, 1.884614944458008,
            2.153846025466919, 2.423077106475830, 2.692307949066162, 2.961538076400757, 3.230768918991089,
            3.500000000000000, 3.769231081008911, 4.038462162017822, 4.307692050933838, 4.576922893524170,
            4.846154212951660, 5.115385055541992, 5.384614944458008, 5.653845787048340, 5.923077106475830,
            6.192306995391846, 6.461537837982178, 6.730769157409668, 7.000000000000000, 7.269230842590332,
            7.538462162017822, 7.807693004608154, 8.076923370361328, 8.346154212951660, 8.615384101867676,
            8.884614944458008, 9.153845787048340, 9.423076629638672, 9.692307472229004, 9.961538314819336,
            10.230770111083984, 10.500000000000000, 10.769231796264648, 11.038461685180664, 11.307692527770996,
            11.576923370361328, 11.846155166625977, 12.115385055541992, 12.384616851806641, 12.653846740722656,
            12.923078536987305, 13.192308425903320, 13.461539268493652, 13.730770111083984, 14.000000000000000,
            14.186100006103516, 14.372200012207031, 14.558300018310547, 14.744399070739746, 14.930499076843262,
            15.116599082946777, 15.302699089050293, 15.488799095153809, 15.674899101257324, 15.860999107360840,
            16.047098159790039, 16.233198165893555, 16.419298171997070, 16.605398178100586, 16.791498184204102,
            16.977598190307617, 17.163698196411133, 17.349798202514648, 17.535898208618164, 17.721998214721680,
            18.445344924926758, 19.168691635131836, 19.530364990234375, 19.530364990234375, 19.892038345336914,
            20.615385055541992, 21.338731765747070, 22.062078475952148, 22.785425186157227, 23.000000000000000,
            27.000000000000000, 32.000000000000000, 38.000000000000000, 44.000000000000000, 51.000000000000000,
            60.000000000000000, 70.000000000000000, 82.000000000000000, 95.000000000000000, 110.000000000000000,
            110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000,
        ],
        [
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.807691991329193, 1.076923012733459, 1.346153974533081, 1.615385055541992, 1.884614944458008,
            2.153846025466919, 2.423077106475830, 2.692307949066162, 2.961538076400757, 3.230768918991089,
            3.500000000000000, 3.769231081008911, 4.038462162017822, 4.307692050933838, 4.576922893524170,
            4.846154212951660, 5.115385055541992, 5.384614944458008, 5.653845787048340, 5.923077106475830,
            6.192306995391846, 6.461537837982178, 6.730769157409668, 7.000000000000000, 7.269230842590332,
            7.538462162017822, 7.807693004608154, 8.076923370361328, 8.346154212951660, 8.615384101867676,
            8.884614944458008, 9.153845787048340, 9.423076629638672, 9.692307472229004, 9.961538314819336,
            10.230770111083984, 10.500000000000000, 10.769231796264648, 11.038461685180664, 11.307692527770996,
            11.576923370361328, 11.846155166625977, 12.115385055541992, 12.384616851806641, 12.653846740722656,
            12.923078536987305, 13.192308425903320, 13.461539268493652, 13.730770111083984, 14.000000000000000,
            14.186100006103516, 14.372200012207031, 14.558300018310547, 14.744399070739746, 14.930499076843262,
            15.116599082946777, 15.302699089050293, 15.488799095153809, 15.674899101257324, 15.860999107360840,
            16.047098159790039, 16.233198165893555, 16.419298171997070, 16.605398178100586, 16.791498184204102,
            16.977598190307617, 17.163698196411133, 17.349798202514648, 17.535898208618164, 17.721998214721680,
            18.445344924926758, 19.168691635131836, 19.530364990234375, 19.530364990234375, 19.892038345336914,
            20.615385055541992, 21.338731765747070, 22.062078475952148, 22.785425186157227, 23.000000000000000,
            27.000000000000000, 32.000000000000000, 38.000000000000000, 44.000000000000000, 51.000000000000000,
            60.000000000000000, 70.000000000000000, 82.000000000000000, 95.000000000000000, 110.000000000000000,
            110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000,
        ],
        [
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.807691991329193, 1.076923012733459, 1.346153974533081, 1.615385055541992, 1.884614944458008,
            2.153846025466919, 2.423077106475830, 2.692307949066162, 2.961538076400757, 3.230768918991089,
            3.500000000000000, 3.769231081008911, 4.038462162017822, 4.307692050933838, 4.576922893524170,
            4.846154212951660, 5.115385055541992, 5.384614944458008, 5.653845787048340, 5.923077106475830,
            6.192306995391846, 6.461537837982178, 6.730769157409668, 7.000000000000000, 7.269230842590332,
            7.538462162017822, 7.807693004608154, 8.076923370361328, 8.346154212951660, 8.615384101867676,
            8.884614944458008, 9.153845787048340, 9.423076629638672, 9.692307472229004, 9.961538314819336,
            10.230770111083984, 10.500000000000000, 10.769231796264648, 11.038461685180664, 11.307692527770996,
            11.576923370361328, 11.846155166625977, 12.115385055541992, 12.384616851806641, 12.653846740722656,
            12.923078536987305, 13.192308425903320, 13.461539268493652, 13.730770111083984, 14.000000000000000,
            14.186100006103516, 14.372200012207031, 14.558300018310547, 14.744399070739746, 14.930499076843262,
            15.116599082946777, 15.302699089050293, 15.488799095153809, 15.674899101257324, 15.860999107360840,
            16.047098159790039, 16.233198165893555, 16.419298171997070, 16.605398178100586, 16.791498184204102,
            16.977598190307617, 17.163698196411133, 17.349798202514648, 17.535898208618164, 17.721998214721680,
            18.445344924926758, 19.168691635131836, 19.530364990234375, 19.530364990234375, 19.892038345336914,
            20.615385055541992, 21.338731765747070, 22.062078475952148, 22.785425186157227, 23.000000000000000,
            27.000000000000000, 32.000000000000000, 38.000000000000000, 44.000000000000000, 51.000000000000000,
            60.000000000000000, 70.000000000000000, 82.000000000000000, 95.000000000000000, 110.000000000000000,
            110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000,
        ],
        [
            0.323077201843262, 0.323077201843262, 0.323077201843262, 0.323077201843262, 0.323077201843262,
            0.323077201843262, 0.323077201843262, 0.323077201843262, 0.323077201843262, 0.323077201843262,
            0.484615206718445, 0.646153807640076, 0.807692408561707, 0.969231009483337, 1.130769014358521,
            1.292307615280151, 1.453846216201782, 1.615384817123413, 1.776922821998596, 1.938461422920227,
            2.099999904632568, 2.261538505554199, 2.423077106475830, 2.584615230560303, 2.746153831481934,
            2.907692432403564, 3.069231033325195, 3.230768918991089, 3.392307519912720, 3.553846120834351,
            3.715384244918823, 3.876922845840454, 4.038461208343506, 4.199999809265137, 4.361538410186768,
            4.523077011108398, 4.684615612030029, 4.846153736114502, 5.007692337036133, 5.169230461120605,
            5.330769062042236, 5.492307662963867, 5.653846263885498, 5.815384387969971, 5.976922988891602,
            6.138462066650391, 6.300000190734863, 6.461539268493652, 6.623077392578125, 6.784615993499756,
            6.946153640747070, 7.107693195343018, 7.269230842590332, 7.430770397186279, 7.592308044433594,
            7.753847599029541, 7.915384769439697, 8.076923370361328, 8.238462448120117, 8.399999618530273,
            8.511659622192383, 8.623319625854492, 8.734979629516602, 8.846639633178711, 8.958299636840820,
            9.069959640502930, 9.181619644165039, 9.293279647827148, 9.404939651489258, 9.516599655151367,
            9.628258705139160, 9.739918708801270, 9.851578712463379, 9.963238716125488, 10.074898719787598,
            10.186558723449707, 10.298218727111816, 10.409878730773926, 10.521538734436035, 10.633198738098145,
            11.067206382751465, 11.501214981079102, 11.718218803405762, 11.718218803405762, 11.935222625732422,
            12.369231224060059, 12.803238868713379, 13.237247467041016, 13.671255111694336, 14.000000000000000,
            16.000000000000000, 20.000000000000000, 22.000000000000000, 26.000000000000000, 30.000000000000000,
            36.000000000000000, 42.000000000000000, 50.000000000000000, 58.000000000000000, 66.000000000000000,
            66.000000000000000, 66.000000000000000, 66.000000000000000, 66.000000000000000, 66.000000000000000,
        ],
        [
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.807691991329193, 1.076923012733459, 1.346153974533081, 1.615385055541992, 1.884614944458008,
            2.153846025466919, 2.423077106475830, 2.692307949066162, 2.961538076400757, 3.230768918991089,
            3.500000000000000, 3.769231081008911, 4.038462162017822, 4.307692050933838, 4.576922893524170,
            4.846154212951660, 5.115385055541992, 5.384614944458008, 5.653845787048340, 5.923077106475830,
            6.192306995391846, 6.461537837982178, 6.730769157409668, 7.000000000000000, 7.269230842590332,
            7.538462162017822, 7.807693004608154, 8.076923370361328, 8.346154212951660, 8.615384101867676,
            8.884614944458008, 9.153845787048340, 9.423076629638672, 9.692307472229004, 9.961538314819336,
            10.230770111083984, 10.500000000000000, 10.769231796264648, 11.038461685180664, 11.307692527770996,
            11.576923370361328, 11.846155166625977, 12.115385055541992, 12.384616851806641, 12.653846740722656,
            12.923078536987305, 13.192308425903320, 13.461539268493652, 13.730770111083984, 14.000000000000000,
            14.186100006103516, 14.372200012207031, 14.558300018310547, 14.744399070739746, 14.930499076843262,
            15.116599082946777, 15.302699089050293, 15.488799095153809, 15.674899101257324, 15.860999107360840,
            16.047098159790039, 16.233198165893555, 16.419298171997070, 16.605398178100586, 16.791498184204102,
            16.977598190307617, 17.163698196411133, 17.349798202514648, 17.535898208618164, 17.721998214721680,
            18.445344924926758, 19.168691635131836, 19.530364990234375, 19.530364990234375, 19.892038345336914,
            20.615385055541992, 21.338731765747070, 22.062078475952148, 22.785425186157227, 23.000000000000000,
            27.000000000000000, 32.000000000000000, 38.000000000000000, 44.000000000000000, 51.000000000000000,
            60.000000000000000, 70.000000000000000, 82.000000000000000, 95.000000000000000, 110.000000000000000,
            110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000,
        ],
        [
            0.357366561889648, 0.357366532087326, 0.357366621494293, 0.357366591691971, 0.357366561889648,
            0.357366621494293, 0.357366591691971, 0.357366561889648, 0.357366532087326, 0.357366591691971,
            0.536050319671631, 0.714734077453613, 0.893416821956635, 1.072100758552551, 1.250784635543823,
            1.429468393325806, 1.608151316642761, 1.786834836006165, 1.965518832206726, 2.144201278686523,
            2.322885274887085, 2.501568794250488, 2.680251836776733, 2.858935356140137, 3.037619352340698,
            3.216301679611206, 3.394985675811768, 3.573669672012329, 3.752353429794312, 3.931035995483398,
            4.109719753265381, 4.288403511047363, 4.467087745666504, 4.645770072937012, 4.824453353881836,
            5.003137111663818, 5.181820392608643, 5.360503673553467, 5.539187908172607, 5.717871189117432,
            5.896554470062256, 6.075237274169922, 6.253921508789062, 6.432604789733887, 6.611288547515869,
            6.789971828460693, 6.968655586242676, 7.147338867187500, 7.326023101806641, 7.504706859588623,
            7.683389663696289, 7.862073421478271, 8.040756225585938, 8.219439506530762, 8.398122787475586,
            8.576807022094727, 8.755489349365234, 8.934174537658691, 9.112856864929199, 9.291540145874023,
            7.329484939575195, 7.425636291503906, 7.521788120269775, 7.617939949035645, 7.714091300964355,
            7.810243129730225, 7.906394481658936, 8.002546310424805, 8.098697662353516, 8.194849014282227,
            8.291001319885254, 8.387152671813965, 8.483304023742676, 8.579455375671387, 8.675607681274414,
            8.771759033203125, 8.867910385131836, 8.964061737060547, 9.060214042663574, 9.156365394592285,
            9.530094146728516, 9.903823852539062, 10.090688705444336, 10.090688705444336, 10.277552604675293,
            10.651282310485840, 11.025011062622070, 11.398740768432617, 11.772470474243164, 12.000000000000000,
            14.000000000000000, 17.000000000000000, 20.000000000000000, 23.000000000000000, 26.000000000000000,
            31.000000000000000, 36.000000000000000, 42.000000000000000, 49.000000000000000, 57.000000000000000,
            57.000000000000000, 57.000000000000000, 57.000000000000000, 57.000000000000000, 57.000000000000000,
        ],
        [
            0.342657625675201, 0.342657625675201, 0.342657625675201, 0.342657625675201, 0.342657625675201,
            0.342657625675201, 0.342657625675201, 0.342657625675201, 0.342657625675201, 0.342657625675201,
            0.513985812664032, 0.685314655303955, 0.856643438339233, 1.027972221374512, 1.199300408363342,
            1.370629310607910, 1.541958093643188, 1.713286876678467, 1.884615063667297, 2.055943965911865,
            2.227272748947144, 2.398601531982422, 2.569930315017700, 2.741258621215820, 2.912587404251099,
            3.083916187286377, 3.255244970321655, 3.426573276519775, 3.597902059555054, 3.769230842590332,
            3.940558910369873, 4.111887931823730, 4.283216476440430, 4.454545497894287, 4.625874042510986,
            4.797203063964844, 4.968532085418701, 5.139860153198242, 5.311188697814941, 5.482517242431641,
            5.653845787048340, 5.825174808502197, 5.996503353118896, 6.167831897735596, 6.339160442352295,
            6.510489940643311, 6.681818008422852, 6.853147506713867, 7.024476051330566, 7.195804595947266,
            7.367132663726807, 7.538462162017822, 7.709790229797363, 7.881119728088379, 8.052448272705078,
            8.223777770996094, 8.395105361938477, 8.566433906555176, 8.737762451171875, 8.909090995788574,
            9.027518272399902, 9.145945549011230, 9.264372825622559, 9.382800102233887, 9.501226425170898,
            9.619653701782227, 9.738080978393555, 9.856508255004883, 9.974935531616211, 10.093362808227539,
            10.211790084838867, 10.330217361450195, 10.448644638061523, 10.567071914672852, 10.685498237609863,
            10.803926467895508, 10.922352790832520, 11.040780067443848, 11.159207344055176, 11.277634620666504,
            11.737947463989258, 12.198257446289062, 12.428413391113281, 12.428413391113281, 12.658569335937500,
            13.118881225585938, 13.579193115234375, 14.039504051208496, 14.499815940856934, 15.000000000000000,
            17.000000000000000, 20.000000000000000, 24.000000000000000, 28.000000000000000, 33.000000000000000,
            38.000000000000000, 45.000000000000000, 52.000000000000000, 61.000000000000000, 70.000000000000000,
            70.000000000000000, 70.000000000000000, 70.000000000000000, 70.000000000000000, 70.000000000000000,
        ],
        [
            0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904,
            0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904,
            0.649038374423981, 0.865384876728058, 1.081730246543884, 1.298076748847961, 1.514423251152039,
            1.730769753456116, 1.947115182876587, 2.163461685180664, 2.379808187484741, 2.596153497695923,
            2.812500000000000, 3.028846502304077, 3.245191812515259, 3.461538314819336, 3.677884817123413,
            3.894230365753174, 4.110576629638672, 4.326923370361328, 4.543269634246826, 4.759614944458008,
            4.975961685180664, 5.192307949066162, 5.408654689788818, 5.625000000000000, 5.841346263885498,
            6.057692050933838, 6.274038314819336, 6.490385055541992, 6.706730365753174, 6.923076629638672,
            7.139423370361328, 7.355769634246826, 7.572114944458008, 7.788461685180664, 8.004808425903320,
            8.221154212951660, 8.437500000000000, 8.653845787048340, 8.870191574096680, 9.086538314819336,
            9.302885055541992, 9.519229888916016, 9.735576629638672, 9.951923370361328, 10.168270111083984,
            10.384614944458008, 10.600961685180664, 10.817308425903320, 11.033654212951660, 11.250000000000000,
            11.304548263549805, 11.452846527099609, 11.601144790649414, 11.749443054199219, 11.897741317749023,
            12.046039581298828, 12.194337844848633, 12.342637062072754, 12.490935325622559, 12.639233589172363,
            12.787531852722168, 12.935830116271973, 13.084128379821777, 13.232426643371582, 13.380724906921387,
            13.529023170471191, 13.677321434020996, 13.825619697570801, 13.973917961120605, 14.122216224670410,
            14.698633193969727, 15.275050163269043, 15.563259124755859, 15.563259124755859, 15.851468086242676,
            16.427885055541992, 17.004301071166992, 17.580718994140625, 18.157135009765625, 18.000000000000000,
            22.500000000000000, 26.100000381469727, 31.500000000000000, 36.000000000000000, 41.400001525878906,
            49.500000000000000, 57.599998474121094, 67.500000000000000, 77.400001525878906, 90.000000000000000,
            90.000000000000000, 90.000000000000000, 90.000000000000000, 90.000000000000000, 90.000000000000000,
        ],
        [
            0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904,
            0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904,
            0.649038374423981, 0.865384876728058, 1.081730246543884, 1.298076748847961, 1.514423251152039,
            1.730769753456116, 1.947115182876587, 2.163461685180664, 2.379808187484741, 2.596153497695923,
            2.812500000000000, 3.028846502304077, 3.245191812515259, 3.461538314819336, 3.677884817123413,
            3.894230365753174, 4.110576629638672, 4.326923370361328, 4.543269634246826, 4.759614944458008,
            4.975961685180664, 5.192307949066162, 5.408654689788818, 5.625000000000000, 5.841346263885498,
            6.057692050933838, 6.274038314819336, 6.490385055541992, 6.706730365753174, 6.923076629638672,
            7.139423370361328, 7.355769634246826, 7.572114944458008, 7.788461685180664, 8.004808425903320,
            8.221154212951660, 8.437500000000000, 8.653845787048340, 8.870191574096680, 9.086538314819336,
            9.302885055541992, 9.519229888916016, 9.735576629638672, 9.951923370361328, 10.168270111083984,
            10.384614944458008, 10.600961685180664, 10.817308425903320, 11.033654212951660, 11.250000000000000,
            11.304548263549805, 11.452846527099609, 11.601144790649414, 11.749443054199219, 11.897741317749023,
            12.046039581298828, 12.194337844848633, 12.342637062072754, 12.490935325622559, 12.639233589172363,
            12.787531852722168, 12.935830116271973, 13.084128379821777, 13.232426643371582, 13.380724906921387,
            13.529023170471191, 13.677321434020996, 13.825619697570801, 13.973917961120605, 14.122216224670410,
            14.698633193969727, 15.275050163269043, 15.563259124755859, 15.563259124755859, 15.851468086242676,
            16.427885055541992, 17.004301071166992, 17.580718994140625, 18.157135009765625, 18.000000000000000,
            22.500000000000000, 26.100000381469727, 31.500000000000000, 36.000000000000000, 41.400001525878906,
            49.500000000000000, 57.599998474121094, 67.500000000000000, 77.400001525878906, 90.000000000000000,
            90.000000000000000, 90.000000000000000, 90.000000000000000, 90.000000000000000, 90.000000000000000,
        ],
        [
            0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904,
            0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904, 0.432691872119904,
            0.649038374423981, 0.865384876728058, 1.081730246543884, 1.298076748847961, 1.514423251152039,
            1.730769753456116, 1.947115182876587, 2.163461685180664, 2.379808187484741, 2.596153497695923,
            2.812500000000000, 3.028846502304077, 3.245191812515259, 3.461538314819336, 3.677884817123413,
            3.894230365753174, 4.110576629638672, 4.326923370361328, 4.543269634246826, 4.759614944458008,
            4.975961685180664, 5.192307949066162, 5.408654689788818, 5.625000000000000, 5.841346263885498,
            6.057692050933838, 6.274038314819336, 6.490385055541992, 6.706730365753174, 6.923076629638672,
            7.139423370361328, 7.355769634246826, 7.572114944458008, 7.788461685180664, 8.004808425903320,
            8.221154212951660, 8.437500000000000, 8.653845787048340, 8.870191574096680, 9.086538314819336,
            9.302885055541992, 9.519229888916016, 9.735576629638672, 9.951923370361328, 10.168270111083984,
            10.384614944458008, 10.600961685180664, 10.817308425903320, 11.033654212951660, 11.250000000000000,
            11.304548263549805, 11.452846527099609, 11.601144790649414, 11.749443054199219, 11.897741317749023,
            12.046039581298828, 12.194337844848633, 12.342637062072754, 12.490935325622559, 12.639233589172363,
            12.787531852722168, 12.935830116271973, 13.084128379821777, 13.232426643371582, 13.380724906921387,
            13.529023170471191, 13.677321434020996, 13.825619697570801, 13.973917961120605, 14.122216224670410,
            14.698633193969727, 15.275050163269043, 15.563259124755859, 15.563259124755859, 15.851468086242676,
            16.427885055541992, 17.004301071166992, 17.580718994140625, 18.157135009765625, 18.000000000000000,
            22.500000000000000, 26.100000381469727, 31.500000000000000, 36.000000000000000, 41.400001525878906,
            49.500000000000000, 57.599998474121094, 67.500000000000000, 77.400001525878906, 90.000000000000000,
            90.000000000000000, 90.000000000000000, 90.000000000000000, 90.000000000000000, 90.000000000000000,
        ],
        [
            0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193,
            0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193, 0.307691991329193,
            0.461537986993790, 0.615384995937347, 0.769231021404266, 0.923076987266541, 1.076923012733459,
            1.230769038200378, 1.384614944458008, 1.538462042808533, 1.692307949066162, 1.846153974533081,
            2.000000000000000, 2.153846025466919, 2.307692050933838, 2.461539030075073, 2.615385055541992,
            2.769231081008911, 2.923077106475830, 3.076922893524170, 3.230768918991089, 3.384614944458008,
            3.538461923599243, 3.692307949066162, 3.846153974533081, 4.000000000000000, 4.153845787048340,
            4.307692050933838, 4.461537837982178, 4.615385055541992, 4.769230842590332, 4.923077106475830,
            5.076922893524170, 5.230769157409668, 5.384614944458008, 5.538462162017822, 5.692306995391846,
            5.846154212951660, 6.000000000000000, 6.153845787048340, 6.307693004608154, 6.461537837982178,
            6.615385055541992, 6.769230842590332, 6.923077106475830, 7.076922893524170, 7.230769157409668,
            7.384614944458008, 7.538462162017822, 7.692306995391846, 7.846154212951660, 8.000000000000000,
            8.038789749145508, 8.144246101379395, 8.249703407287598, 8.355159759521484, 8.460616111755371,
            8.566072463989258, 8.671529769897461, 8.776986122131348, 8.882442474365234, 8.987898826599121,
            9.093356132507324, 9.198812484741211, 9.304268836975098, 9.409725189208984, 9.515182495117188,
            9.620638847351074, 9.726095199584961, 9.831551551818848, 9.937008857727051, 10.042465209960938,
            10.452362060546875, 10.862257957458496, 11.067206382751465, 11.067206382751465, 11.272154808044434,
            11.682051658630371, 12.091947555541992, 12.501844406127930, 12.911741256713867, 13.000000000000000,
            15.000000000000000, 18.000000000000000, 22.000000000000000, 25.000000000000000, 29.000000000000000,
            34.000000000000000, 40.000000000000000, 46.000000000000000, 54.000000000000000, 62.000000000000000,
            62.000000000000000, 62.000000000000000, 62.000000000000000, 62.000000000000000, 62.000000000000000,
        ],
        [
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888, 0.538461983203888,
            0.807691991329193, 1.076923012733459, 1.346153974533081, 1.615385055541992, 1.884614944458008,
            2.153846025466919, 2.423077106475830, 2.692307949066162, 2.961538076400757, 3.230768918991089,
            3.500000000000000, 3.769231081008911, 4.038462162017822, 4.307692050933838, 4.576922893524170,
            4.846154212951660, 5.115385055541992, 5.384614944458008, 5.653845787048340, 5.923077106475830,
            6.192306995391846, 6.461537837982178, 6.730769157409668, 7.000000000000000, 7.269230842590332,
            7.538462162017822, 7.807693004608154, 8.076923370361328, 8.346154212951660, 8.615384101867676,
            8.884614944458008, 9.153845787048340, 9.423076629638672, 9.692307472229004, 9.961538314819336,
            10.230770111083984, 10.500000000000000, 10.769231796264648, 11.038461685180664, 11.307692527770996,
            11.576923370361328, 11.846155166625977, 12.115385055541992, 12.384616851806641, 12.653846740722656,
            12.923078536987305, 13.192308425903320, 13.461539268493652, 13.730770111083984, 14.000000000000000,
            14.186100006103516, 14.372200012207031, 14.558300018310547, 14.744399070739746, 14.930499076843262,
            15.116599082946777, 15.302699089050293, 15.488799095153809, 15.674899101257324, 15.860999107360840,
            16.047098159790039, 16.233198165893555, 16.419298171997070, 16.605398178100586, 16.791498184204102,
            16.977598190307617, 17.163698196411133, 17.349798202514648, 17.535898208618164, 17.721998214721680,
            18.445344924926758, 19.168691635131836, 19.530364990234375, 19.530364990234375, 19.892038345336914,
            20.615385055541992, 21.338731765747070, 22.062078475952148, 22.785425186157227, 23.000000000000000,
            27.000000000000000, 32.000000000000000, 38.000000000000000, 44.000000000000000, 51.000000000000000,
            60.000000000000000, 70.000000000000000, 82.000000000000000, 95.000000000000000, 110.000000000000000,
            110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000,
        ],
        [
            0.237820714712143, 0.237820714712143, 0.237820714712143, 0.237820714712143, 0.237820714712143,
            0.237820714712143, 0.237820714712143, 0.237820714712143, 0.237820714712143, 0.237820714712143,
            0.356730639934540, 0.475640982389450, 0.594551324844360, 0.713461697101593, 0.832371652126312,
            0.951281964778900, 1.070192337036133, 1.189102649688721, 1.308012604713440, 1.426922917366028,
            1.545833349227905, 1.664743661880493, 1.783654093742371, 1.902563929557800, 2.021474361419678,
            2.140384674072266, 2.259294986724854, 2.378205060958862, 2.497115373611450, 2.616025686264038,
            2.734935522079468, 2.853845834732056, 2.972756385803223, 3.091666698455811, 3.210577011108398,
            3.329487323760986, 3.448397636413574, 3.567307710647583, 3.686218023300171, 3.805127859115601,
            3.924038410186768, 4.042948722839355, 4.161859035491943, 4.280768871307373, 4.399679183959961,
            4.518589973449707, 4.637499809265137, 4.756410598754883, 4.875320911407471, 4.994231224060059,
            5.113141059875488, 5.232051849365234, 5.350961685180664, 5.469872474670410, 5.588782310485840,
            5.707693099975586, 5.826602935791016, 5.945513248443604, 6.064423561096191, 6.183333396911621,
            6.265527248382568, 6.347721576690674, 6.429915428161621, 6.512109756469727, 6.594304084777832,
            6.676497936248779, 6.758692264556885, 6.840886116027832, 6.923080444335938, 7.005274295806885,
            7.087468624114990, 7.169662475585938, 7.251856803894043, 7.334050655364990, 7.416244983673096,
            7.498438835144043, 7.580633163452148, 7.662827491760254, 7.745021343231201, 7.827215671539307,
            8.146693229675293, 8.466172218322754, 8.625910758972168, 8.625910758972168, 8.785650253295898,
            9.105128288269043, 9.424606323242188, 9.744084358215332, 10.063562393188477, 10.000000000000000,
            12.000000000000000, 14.000000000000000, 17.000000000000000, 19.000000000000000, 23.000000000000000,
            27.000000000000000, 31.000000000000000, 36.000000000000000, 42.000000000000000, 49.000000000000000,
            49.000000000000000, 49.000000000000000, 49.000000000000000, 49.000000000000000, 49.000000000000000,
        ],
        [
            0.636364161968231, 0.636364161968231, 0.636364161968231, 0.636364161968231, 0.636364161968231,
            0.636364161968231, 0.636364161968231, 0.636364161968231, 0.636364161968231, 0.636364161968231,
            0.954545080661774, 1.272727131843567, 1.590909242630005, 1.909091353416443, 2.227272272109985,
            2.545454263687134, 2.863636493682861, 3.181818485260010, 3.499999523162842, 3.818181514739990,
            4.136363506317139, 4.454545497894287, 4.772727966308594, 5.090908527374268, 5.409090995788574,
            5.727272987365723, 6.045454978942871, 6.363636016845703, 6.681818008422852, 7.000000000000000,
            7.318181037902832, 7.636363029479980, 7.954545021057129, 8.272727012634277, 8.590909004211426,
            8.909090995788574, 9.227273941040039, 9.545454025268555, 9.863636970520020, 10.181817054748535,
            10.500000000000000, 10.818181991577148, 11.136363983154297, 11.454545021057129, 11.772727012634277,
            12.090909957885742, 12.409090995788574, 12.727273941040039, 13.045454978942871, 13.363636970520020,
            13.681818008422852, 14.000000953674316, 14.318181991577148, 14.636365890502930, 14.954545974731445,
            15.272729873657227, 15.590909004211426, 15.909091949462891, 16.227273941040039, 16.545454025268555,
            16.765390396118164, 16.985326766967773, 17.205263137817383, 17.425199508666992, 17.645135879516602,
            17.865072250366211, 18.085008621215820, 18.304944992065430, 18.524879455566406, 18.744815826416016,
            18.964752197265625, 19.184688568115234, 19.404624938964844, 19.624561309814453, 19.844497680664062,
            20.064434051513672, 20.284370422363281, 20.504306793212891, 20.724243164062500, 20.944179534912109,
            21.799043655395508, 22.653907775878906, 23.081338882446289, 23.081338882446289, 23.508771896362305,
            24.363636016845703, 25.218500137329102, 26.073366165161133, 26.928230285644531, 27.000000000000000,
            32.000000000000000, 38.000000000000000, 45.000000000000000, 52.000000000000000, 60.000000000000000,
            71.000000000000000, 83.000000000000000, 97.000000000000000, 112.000000000000000, 130.000000000000000,
            130.000000000000000, 130.000000000000000, 130.000000000000000, 130.000000000000000, 130.000000000000000,
        ],
        [
            0.636364161968231, 0.636364161968231, 0.636364161968231, 0.636364161968231, 0.636364161968231,
            0.636364161968231, 0.636364161968231, 0.636364161968231, 0.636364161968231, 0.636364161968231,
            0.954545080661774, 1.272727131843567, 1.590909242630005, 1.909091353416443, 2.227272272109985,
            2.545454263687134, 2.863636493682861, 3.181818485260010, 3.499999523162842, 3.818181514739990,
            4.136363506317139, 4.454545497894287, 4.772727966308594, 5.090908527374268, 5.409090995788574,
            5.727272987365723, 6.045454978942871, 6.363636016845703, 6.681818008422852, 7.000000000000000,
            7.318181037902832, 7.636363029479980, 7.954545021057129, 8.272727012634277, 8.590909004211426,
            8.909090995788574, 9.227273941040039, 9.545454025268555, 9.863636970520020, 10.181817054748535,
            10.500000000000000, 10.818181991577148, 11.136363983154297, 11.454545021057129, 11.772727012634277,
            12.090909957885742, 12.409090995788574, 12.727273941040039, 13.045454978942871, 13.363636970520020,
            13.681818008422852, 14.000000953674316, 14.318181991577148, 14.636365890502930, 14.954545974731445,
            15.272729873657227, 15.590909004211426, 15.909091949462891, 16.227273941040039, 16.545454025268555,
            16.765390396118164, 16.985326766967773, 17.205263137817383, 17.425199508666992, 17.645135879516602,
            17.865072250366211, 18.085008621215820, 18.304944992065430, 18.524879455566406, 18.744815826416016,
            18.964752197265625, 19.184688568115234, 19.404624938964844, 19.624561309814453, 19.844497680664062,
            20.064434051513672, 20.284370422363281, 20.504306793212891, 20.724243164062500, 20.944179534912109,
            21.799043655395508, 22.653907775878906, 23.081338882446289, 23.081338882446289, 23.508771896362305,
            24.363636016845703, 25.218500137329102, 26.073366165161133, 26.928230285644531, 27.000000000000000,
            32.000000000000000, 38.000000000000000, 45.000000000000000, 52.000000000000000, 60.000000000000000,
            71.000000000000000, 83.000000000000000, 97.000000000000000, 112.000000000000000, 130.000000000000000,
            110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000, 110.000000000000000,
        ],
        [
            1.272728323936462, 1.272728323936462, 1.272728323936462, 1.272728323936462, 1.272728323936462,
            1.272728323936462, 1.272728323936462, 1.272728323936462, 1.272728323936462, 1.272728323936462,
            1.909090161323547, 2.545454263687134, 3.181818485260010, 3.818182706832886, 4.454544544219971,
            5.090908527374268, 5.727272987365723, 6.363636970520020, 6.999999046325684, 7.636363029479980,
            8.272727012634277, 8.909090995788574, 9.545455932617188, 10.181817054748535, 10.818181991577148,
            11.454545974731445, 12.090909957885742, 12.727272033691406, 13.363636016845703, 14.000000000000000,
            14.636362075805664, 15.272726058959961, 15.909090042114258, 16.545454025268555, 17.181818008422852,
            17.818181991577148, 18.454547882080078, 19.090908050537109, 19.727273941040039, 20.363634109497070,
            21.000000000000000, 21.636363983154297, 22.272727966308594, 22.909090042114258, 23.545454025268555,
            24.181819915771484, 24.818181991577148, 25.454547882080078, 26.090909957885742, 26.727273941040039,
            27.363636016845703, 28.000001907348633, 28.636363983154297, 29.272731781005859, 29.909093856811523,
            30.545459747314453, 31.181818008422852, 31.818183898925781, 32.454547882080078, 33.090908050537109,
            33.530780792236328, 33.970653533935547, 34.410526275634766, 34.850399017333984, 35.290271759033203,
            35.730144500732422, 36.170017242431641, 36.609889984130859, 37.049758911132812, 37.489631652832031,
            37.929504394531250, 38.369377136230469, 38.809249877929688, 39.249122619628906, 39.688995361328125,
            40.128868103027344, 40.568740844726562, 41.008613586425781, 41.448486328125000, 41.888359069824219,
            43.598087310791016, 45.307815551757812, 46.162677764892578, 46.162677764892578, 47.017543792724609,
            48.727272033691406, 50.437000274658203, 52.146732330322266, 53.856460571289062, 54.000000000000000,
            64.000000000000000, 76.000000000000000, 90.000000000000000, 104.000000000000000, 120.000000000000000,
            142.000000000000000, 166.000000000000000, 194.000000000000000, 224.000000000000000, 260.000000000000000,
            55.000000000000000, 55.000000000000000, 55.000000000000000, 55.000000000000000, 55.000000000000000,
        ],
        [
            0.122377723455429, 0.122377723455429, 0.122377723455429, 0.122377723455429, 0.122377723455429,
            0.122377723455429, 0.122377723455429, 0.122377723455429, 0.122377723455429, 0.122377723455429,
            0.183566361665726, 0.244755223393440, 0.305944085121155, 0.367132961750031, 0.428321599960327,
            0.489510446786880, 0.550699293613434, 0.611888170242310, 0.673076808452606, 0.734265685081482,
            0.795454561710358, 0.856643438339233, 0.917832255363464, 0.979020893573761, 1.040209770202637,
            1.101398587226868, 1.162587523460388, 1.223776102066040, 1.284965038299561, 1.346153855323792,
            1.407342553138733, 1.468531370162964, 1.529720187187195, 1.590909123420715, 1.652097940444946,
            1.713286876678467, 1.774475693702698, 1.835664272308350, 1.896853208541870, 1.958041787147522,
            2.019230604171753, 2.080419540405273, 2.141608476638794, 2.202796936035156, 2.263985872268677,
            2.325175046920776, 2.386363744735718, 2.447552680969238, 2.508741378784180, 2.569930315017700,
            2.631118774414062, 2.692307949066162, 2.753496646881104, 2.814685583114624, 2.875874280929565,
            2.937063455581665, 2.998251914978027, 3.059440612792969, 3.120629549026489, 3.181818246841431,
            3.224113702774048, 3.266408920288086, 3.308704376220703, 3.350999832153320, 3.393295288085938,
            3.435590744018555, 3.477886199951172, 3.520181655883789, 3.562477111816406, 3.604772329330444,
            3.647067785263062, 3.689363241195679, 3.731658697128296, 3.773954153060913, 3.816249608993530,
            3.858545064926147, 3.900840282440186, 3.943135738372803, 3.985431194305420, 4.027726650238037,
            4.192123889923096, 4.356520652770996, 4.438719272613525, 4.438719272613525, 4.520917892456055,
            4.685314655303955, 4.849711894989014, 5.000000000000000, 5.000000000000000, 5.000000000000000,
            6.000000000000000, 7.000000000000000, 9.000000000000000, 10.000000000000000, 12.000000000000000,
            14.000000000000000, 16.000000000000000, 19.000000000000000, 22.000000000000000, 25.000000000000000,
            25.000000000000000, 25.000000000000000, 25.000000000000000, 25.000000000000000, 25.000000000000000,
        ],
        [
            0.122377723455429, 0.122377723455429, 0.122377723455429, 0.122377723455429, 0.122377723455429,
            0.122377723455429, 0.122377723455429, 0.122377723455429, 0.122377723455429, 0.122377723455429,
            0.183566361665726, 0.244755223393440, 0.305944085121155, 0.367132961750031, 0.428321599960327,
            0.489510446786880, 0.550699293613434, 0.611888170242310, 0.673076808452606, 0.734265685081482,
            0.795454561710358, 0.856643438339233, 0.917832255363464, 0.979020893573761, 1.040209770202637,
            1.101398587226868, 1.162587523460388, 1.223776102066040, 1.284965038299561, 1.346153855323792,
            1.407342553138733, 1.468531370162964, 1.529720187187195, 1.590909123420715, 1.652097940444946,
            1.713286876678467, 1.774475693702698, 1.835664272308350, 1.896853208541870, 1.958041787147522,
            2.019230604171753, 2.080419540405273, 2.141608476638794, 2.202796936035156, 2.263985872268677,
            2.325175046920776, 2.386363744735718, 2.447552680969238, 2.508741378784180, 2.569930315017700,
            2.631118774414062, 2.692307949066162, 2.753496646881104, 2.814685583114624, 2.875874280929565,
            2.937063455581665, 2.998251914978027, 3.059440612792969, 3.120629549026489, 3.181818246841431,
            3.224113702774048, 3.266408920288086, 3.308704376220703, 3.350999832153320, 3.393295288085938,
            3.435590744018555, 3.477886199951172, 3.520181655883789, 3.562477111816406, 3.604772329330444,
            3.647067785263062, 3.689363241195679, 3.731658697128296, 3.773954153060913, 3.816249608993530,
            3.858545064926147, 3.900840282440186, 3.943135738372803, 3.985431194305420, 4.027726650238037,
            4.192123889923096, 4.356520652770996, 4.438719272613525, 4.438719272613525, 4.520917892456055,
            4.685314655303955, 4.849711894989014, 5.000000000000000, 5.000000000000000, 5.000000000000000,
            6.000000000000000, 7.000000000000000, 9.000000000000000, 10.000000000000000, 12.000000000000000,
            14.000000000000000, 16.000000000000000, 19.000000000000000, 22.000000000000000, 25.000000000000000,
            25.000000000000000, 25.000000000000000, 25.000000000000000, 25.000000000000000, 25.000000000000000,
        ],
    ];
    var hp_per_stamina = [
        14.000000000000000, 14.000000000000000, 15.000000000000000, 16.000000000000000, 17.000000000000000,
        18.000000000000000, 18.000000000000000, 18.000000000000000, 18.000000000000000, 18.000000000000000,
        18.000000000000000, 18.000000000000000, 18.000000000000000, 18.000000000000000, 18.000000000000000,
        18.000000000000000, 18.000000000000000, 18.000000000000000, 19.000000000000000, 19.000000000000000,
        20.000000000000000, 20.000000000000000, 20.000000000000000, 20.000000000000000, 22.000000000000000,
        22.000000000000000, 22.000000000000000, 22.000000000000000, 24.000000000000000, 24.000000000000000,
        24.000000000000000, 24.000000000000000, 25.000000000000000, 25.000000000000000, 26.000000000000000,
        26.000000000000000, 26.000000000000000, 26.000000000000000, 28.000000000000000, 28.000000000000000,
        28.000000000000000, 28.000000000000000, 29.000000000000000, 29.000000000000000, 30.000000000000000,
        30.000000000000000, 31.000000000000000, 31.000000000000000, 32.000000000000000, 32.000000000000000,
        33.000000000000000, 33.000000000000000, 33.000000000000000, 34.000000000000000, 34.000000000000000,
        34.000000000000000, 35.000000000000000, 35.000000000000000, 36.000000000000000, 36.000000000000000,
        36.000000000000000, 36.000000000000000, 36.000000000000000, 36.000000000000000, 36.000000000000000,
        36.000000000000000, 36.000000000000000, 36.000000000000000, 37.000000000000000, 37.000000000000000,
        37.000000000000000, 37.000000000000000, 37.000000000000000, 37.000000000000000, 38.000000000000000,
        39.000000000000000, 40.000000000000000, 42.000000000000000, 42.000000000000000, 43.000000000000000,
        43.000000000000000, 43.000000000000000, 44.000000000000000, 46.000000000000000, 47.000000000000000,
        48.000000000000000, 48.000000000000000, 48.000000000000000, 49.000000000000000, 49.000000000000000,
        49.000000000000000, 53.000000000000000, 55.000000000000000, 58.000000000000000, 60.000000000000000,
        60.000000000000000, 60.000000000000000, 60.000000000000000, 60.000000000000000, 60.000000000000000,
        60.000000000000000, 60.000000000000000, 60.000000000000000, 60.000000000000000, 60.000000000000000,
    ];
    var mana_by_class = [
        [
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
        ],
        [
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
        ],
        [
            31.000000000000000, 34.000000000000000, 36.000000000000000, 42.000000000000000, 71.000000000000000,
            101.000000000000000, 104.000000000000000, 137.000000000000000, 140.000000000000000, 173.000000000000000,
            176.000000000000000, 212.000000000000000, 220.000000000000000, 252.000000000000000, 256.000000000000000,
            292.000000000000000, 298.000000000000000, 334.000000000000000, 362.000000000000000, 400.000000000000000,
            420.000000000000000, 460.000000000000000, 480.000000000000000, 520.000000000000000, 580.000000000000000,
            620.000000000000000, 620.000000000000000, 660.000000000000000, 740.000000000000000, 780.000000000000000,
            780.000000000000000, 840.000000000000000, 880.000000000000000, 940.000000000000000, 980.000000000000000,
            1020.000000000000000, 1040.000000000000000, 1080.000000000000000, 1180.000000000000000, 1240.000000000000000,
            1240.000000000000000, 1300.000000000000000, 1360.000000000000000, 1420.000000000000000, 1480.000000000000000,
            1540.000000000000000, 1600.000000000000000, 1660.000000000000000, 1720.000000000000000, 1780.000000000000000,
            1840.000000000000000, 1920.000000000000000, 1940.000000000000000, 2040.000000000000000, 2060.000000000000000,
            2140.000000000000000, 2200.000000000000000, 2280.000000000000000, 2360.000000000000000, 2420.000000000000000,
            2600.000000000000000, 2760.000000000000000, 2920.000000000000000, 2940.000000000000000, 3020.000000000000000,
            3020.000000000000000, 3080.000000000000000, 3100.000000000000000, 3260.000000000000000, 3380.000000000000000,
            3520.000000000000000, 3700.000000000000000, 3860.000000000000000, 3880.000000000000000, 4060.000000000000000,
            4180.000000000000000, 4360.000000000000000, 4600.000000000000000, 4680.000000000000000, 4880.000000000000000,
            5100.000000000000000, 5280.000000000000000, 5520.000000000000000, 5780.000000000000000, 6000.000000000000000,
            6400.000000000000000, 6600.000000000000000, 6800.000000000000000, 7200.000000000000000, 7400.000000000000000,
            10200.000000000000000, 13000.000000000000000, 15600.000000000000000, 19400.000000000000000, 24000.000000000000000,
            27600.000000000000000, 28800.000000000000000, 30000.000000000000000, 31000.000000000000000, 32000.000000000000000,
            32000.000000000000000, 32000.000000000000000, 32000.000000000000000, 32000.000000000000000, 32000.000000000000000,
        ],
        [
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
        ],
        [
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
        ],
        [
            155.000000000000000, 170.000000000000000, 180.000000000000000, 210.000000000000000, 355.000000000000000,
            505.000000000000000, 520.000000000000000, 685.000000000000000, 700.000000000000000, 865.000000000000000,
            880.000000000000000, 1060.000000000000000, 1100.000000000000000, 1260.000000000000000, 1280.000000000000000,
            1460.000000000000000, 1490.000000000000000, 1670.000000000000000, 1810.000000000000000, 2000.000000000000000,
            2100.000000000000000, 2300.000000000000000, 2400.000000000000000, 2600.000000000000000, 2900.000000000000000,
            3100.000000000000000, 3100.000000000000000, 3300.000000000000000, 3700.000000000000000, 3900.000000000000000,
            3900.000000000000000, 4200.000000000000000, 4400.000000000000000, 4700.000000000000000, 4900.000000000000000,
            5100.000000000000000, 5200.000000000000000, 5400.000000000000000, 5900.000000000000000, 6200.000000000000000,
            6200.000000000000000, 6500.000000000000000, 6800.000000000000000, 7100.000000000000000, 7400.000000000000000,
            7700.000000000000000, 8000.000000000000000, 8300.000000000000000, 8600.000000000000000, 8900.000000000000000,
            9200.000000000000000, 9600.000000000000000, 9700.000000000000000, 10200.000000000000000, 10300.000000000000000,
            10700.000000000000000, 11000.000000000000000, 11400.000000000000000, 11800.000000000000000, 12100.000000000000000,
            13000.000000000000000, 13800.000000000000000, 14600.000000000000000, 14700.000000000000000, 15100.000000000000000,
            15100.000000000000000, 15400.000000000000000, 15500.000000000000000, 16300.000000000000000, 16900.000000000000000,
            17600.000000000000000, 18500.000000000000000, 19300.000000000000000, 19400.000000000000000, 20300.000000000000000,
            20900.000000000000000, 21800.000000000000000, 23000.000000000000000, 23400.000000000000000, 24400.000000000000000,
            25500.000000000000000, 26400.000000000000000, 27600.000000000000000, 28900.000000000000000, 30000.000000000000000,
            32000.000000000000000, 33000.000000000000000, 34000.000000000000000, 36000.000000000000000, 37000.000000000000000,
            51000.000000000000000, 65000.000000000000000, 78000.000000000000000, 97000.000000000000000, 120000.000000000000000,
            138000.000000000000000, 144000.000000000000000, 150000.000000000000000, 155000.000000000000000, 160000.000000000000000,
            160000.000000000000000, 160000.000000000000000, 160000.000000000000000, 160000.000000000000000, 160000.000000000000000,
        ],
        [
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
            0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000, 0.000000000000000,
        ],
        [
            31.000000000000000, 34.000000000000000, 36.000000000000000, 42.000000000000000, 71.000000000000000,
            101.000000000000000, 104.000000000000000, 137.000000000000000, 140.000000000000000, 173.000000000000000,
            176.000000000000000, 212.000000000000000, 220.000000000000000, 252.000000000000000, 256.000000000000000,
            292.000000000000000, 298.000000000000000, 334.000000000000000, 362.000000000000000, 400.000000000000000,
            420.000000000000000, 460.000000000000000, 480.000000000000000, 520.000000000000000, 580.000000000000000,
            620.000000000000000, 620.000000000000000, 660.000000000000000, 740.000000000000000, 780.000000000000000,
            780.000000000000000, 840.000000000000000, 880.000000000000000, 940.000000000000000, 980.000000000000000,
            1020.000000000000000, 1040.000000000000000, 1080.000000000000000, 1180.000000000000000, 1240.000000000000000,
            1240.000000000000000, 1300.000000000000000, 1360.000000000000000, 1420.000000000000000, 1480.000000000000000,
            1540.000000000000000, 1600.000000000000000, 1660.000000000000000, 1720.000000000000000, 1780.000000000000000,
            1840.000000000000000, 1920.000000000000000, 1940.000000000000000, 2040.000000000000000, 2060.000000000000000,
            2140.000000000000000, 2200.000000000000000, 2280.000000000000000, 2360.000000000000000, 2420.000000000000000,
            2600.000000000000000, 2760.000000000000000, 2920.000000000000000, 2940.000000000000000, 3020.000000000000000,
            3020.000000000000000, 3080.000000000000000, 3100.000000000000000, 3260.000000000000000, 3380.000000000000000,
            3520.000000000000000, 3700.000000000000000, 3860.000000000000000, 3880.000000000000000, 4060.000000000000000,
            4180.000000000000000, 4360.000000000000000, 4600.000000000000000, 4680.000000000000000, 4880.000000000000000,
            5100.000000000000000, 5280.000000000000000, 5520.000000000000000, 5780.000000000000000, 6000.000000000000000,
            6400.000000000000000, 6600.000000000000000, 6800.000000000000000, 7200.000000000000000, 7400.000000000000000,
            10200.000000000000000, 13000.000000000000000, 15600.000000000000000, 19400.000000000000000, 24000.000000000000000,
            27600.000000000000000, 28800.000000000000000, 30000.000000000000000, 31000.000000000000000, 32000.000000000000000,
            32000.000000000000000, 32000.000000000000000, 32000.000000000000000, 32000.000000000000000, 32000.000000000000000,
        ],
        [
            155.000000000000000, 170.000000000000000, 180.000000000000000, 210.000000000000000, 355.000000000000000,
            505.000000000000000, 520.000000000000000, 685.000000000000000, 700.000000000000000, 865.000000000000000,
            880.000000000000000, 1060.000000000000000, 1100.000000000000000, 1260.000000000000000, 1280.000000000000000,
            1460.000000000000000, 1490.000000000000000, 1670.000000000000000, 1810.000000000000000, 2000.000000000000000,
            2100.000000000000000, 2300.000000000000000, 2400.000000000000000, 2600.000000000000000, 2900.000000000000000,
            3100.000000000000000, 3100.000000000000000, 3300.000000000000000, 3700.000000000000000, 3900.000000000000000,
            3900.000000000000000, 4200.000000000000000, 4400.000000000000000, 4700.000000000000000, 4900.000000000000000,
            5100.000000000000000, 5200.000000000000000, 5400.000000000000000, 5900.000000000000000, 6200.000000000000000,
            6200.000000000000000, 6500.000000000000000, 6800.000000000000000, 7100.000000000000000, 7400.000000000000000,
            7700.000000000000000, 8000.000000000000000, 8300.000000000000000, 8600.000000000000000, 8900.000000000000000,
            9200.000000000000000, 9600.000000000000000, 9700.000000000000000, 10200.000000000000000, 10300.000000000000000,
            10700.000000000000000, 11000.000000000000000, 11400.000000000000000, 11800.000000000000000, 12100.000000000000000,
            13000.000000000000000, 13800.000000000000000, 14600.000000000000000, 14700.000000000000000, 15100.000000000000000,
            15100.000000000000000, 15400.000000000000000, 15500.000000000000000, 16300.000000000000000, 16900.000000000000000,
            17600.000000000000000, 18500.000000000000000, 19300.000000000000000, 19400.000000000000000, 20300.000000000000000,
            20900.000000000000000, 21800.000000000000000, 23000.000000000000000, 23400.000000000000000, 24400.000000000000000,
            25500.000000000000000, 26400.000000000000000, 27600.000000000000000, 28900.000000000000000, 30000.000000000000000,
            32000.000000000000000, 33000.000000000000000, 34000.000000000000000, 36000.000000000000000, 37000.000000000000000,
            51000.000000000000000, 65000.000000000000000, 78000.000000000000000, 97000.000000000000000, 120000.000000000000000,
            138000.000000000000000, 144000.000000000000000, 150000.000000000000000, 155000.000000000000000, 160000.000000000000000,
            160000.000000000000000, 160000.000000000000000, 160000.000000000000000, 160000.000000000000000, 160000.000000000000000,
        ],
        [
            155.000000000000000, 170.000000000000000, 180.000000000000000, 210.000000000000000, 355.000000000000000,
            505.000000000000000, 520.000000000000000, 685.000000000000000, 700.000000000000000, 865.000000000000000,
            880.000000000000000, 1060.000000000000000, 1100.000000000000000, 1260.000000000000000, 1280.000000000000000,
            1460.000000000000000, 1490.000000000000000, 1670.000000000000000, 1810.000000000000000, 2000.000000000000000,
            2100.000000000000000, 2300.000000000000000, 2400.000000000000000, 2600.000000000000000, 2900.000000000000000,
            3100.000000000000000, 3100.000000000000000, 3300.000000000000000, 3700.000000000000000, 3900.000000000000000,
            3900.000000000000000, 4200.000000000000000, 4400.000000000000000, 4700.000000000000000, 4900.000000000000000,
            5100.000000000000000, 5200.000000000000000, 5400.000000000000000, 5900.000000000000000, 6200.000000000000000,
            6200.000000000000000, 6500.000000000000000, 6800.000000000000000, 7100.000000000000000, 7400.000000000000000,
            7700.000000000000000, 8000.000000000000000, 8300.000000000000000, 8600.000000000000000, 8900.000000000000000,
            9200.000000000000000, 9600.000000000000000, 9700.000000000000000, 10200.000000000000000, 10300.000000000000000,
            10700.000000000000000, 11000.000000000000000, 11400.000000000000000, 11800.000000000000000, 12100.000000000000000,
            13000.000000000000000, 13800.000000000000000, 14600.000000000000000, 14700.000000000000000, 15100.000000000000000,
            15100.000000000000000, 15400.000000000000000, 15500.000000000000000, 16300.000000000000000, 16900.000000000000000,
            17600.000000000000000, 18500.000000000000000, 19300.000000000000000, 19400.000000000000000, 20300.000000000000000,
            20900.000000000000000, 21800.000000000000000, 23000.000000000000000, 23400.000000000000000, 24400.000000000000000,
            25500.000000000000000, 26400.000000000000000, 27600.000000000000000, 28900.000000000000000, 30000.000000000000000,
            32000.000000000000000, 33000.000000000000000, 34000.000000000000000, 36000.000000000000000, 37000.000000000000000,
            51000.000000000000000, 65000.000000000000000, 78000.000000000000000, 97000.000000000000000, 120000.000000000000000,
            138000.000000000000000, 144000.000000000000000, 150000.000000000000000, 155000.000000000000000, 160000.000000000000000,
            160000.000000000000000, 160000.000000000000000, 160000.000000000000000, 160000.000000000000000, 160000.000000000000000,
        ],
        [
            155.000000000000000, 170.000000000000000, 180.000000000000000, 210.000000000000000, 355.000000000000000,
            505.000000000000000, 520.000000000000000, 685.000000000000000, 700.000000000000000, 865.000000000000000,
            880.000000000000000, 1060.000000000000000, 1100.000000000000000, 1260.000000000000000, 1280.000000000000000,
            1460.000000000000000, 1490.000000000000000, 1670.000000000000000, 1810.000000000000000, 2000.000000000000000,
            2100.000000000000000, 2300.000000000000000, 2400.000000000000000, 2600.000000000000000, 2900.000000000000000,
            3100.000000000000000, 3100.000000000000000, 3300.000000000000000, 3700.000000000000000, 3900.000000000000000,
            3900.000000000000000, 4200.000000000000000, 4400.000000000000000, 4700.000000000000000, 4900.000000000000000,
            5100.000000000000000, 5200.000000000000000, 5400.000000000000000, 5900.000000000000000, 6200.000000000000000,
            6200.000000000000000, 6500.000000000000000, 6800.000000000000000, 7100.000000000000000, 7400.000000000000000,
            7700.000000000000000, 8000.000000000000000, 8300.000000000000000, 8600.000000000000000, 8900.000000000000000,
            9200.000000000000000, 9600.000000000000000, 9700.000000000000000, 10200.000000000000000, 10300.000000000000000,
            10700.000000000000000, 11000.000000000000000, 11400.000000000000000, 11800.000000000000000, 12100.000000000000000,
            13000.000000000000000, 13800.000000000000000, 14600.000000000000000, 14700.000000000000000, 15100.000000000000000,
            15100.000000000000000, 15400.000000000000000, 15500.000000000000000, 16300.000000000000000, 16900.000000000000000,
            17600.000000000000000, 18500.000000000000000, 19300.000000000000000, 19400.000000000000000, 20300.000000000000000,
            20900.000000000000000, 21800.000000000000000, 23000.000000000000000, 23400.000000000000000, 24400.000000000000000,
            25500.000000000000000, 26400.000000000000000, 27600.000000000000000, 28900.000000000000000, 30000.000000000000000,
            32000.000000000000000, 33000.000000000000000, 34000.000000000000000, 36000.000000000000000, 37000.000000000000000,
            51000.000000000000000, 65000.000000000000000, 78000.000000000000000, 97000.000000000000000, 120000.000000000000000,
            138000.000000000000000, 144000.000000000000000, 150000.000000000000000, 155000.000000000000000, 160000.000000000000000,
            160000.000000000000000, 160000.000000000000000, 160000.000000000000000, 160000.000000000000000, 160000.000000000000000,
        ],
        [
            31.000000000000000, 34.000000000000000, 36.000000000000000, 42.000000000000000, 71.000000000000000,
            101.000000000000000, 104.000000000000000, 137.000000000000000, 140.000000000000000, 173.000000000000000,
            176.000000000000000, 212.000000000000000, 220.000000000000000, 252.000000000000000, 256.000000000000000,
            292.000000000000000, 298.000000000000000, 334.000000000000000, 362.000000000000000, 400.000000000000000,
            420.000000000000000, 460.000000000000000, 480.000000000000000, 520.000000000000000, 580.000000000000000,
            620.000000000000000, 620.000000000000000, 660.000000000000000, 740.000000000000000, 780.000000000000000,
            780.000000000000000, 840.000000000000000, 880.000000000000000, 940.000000000000000, 980.000000000000000,
            1020.000000000000000, 1040.000000000000000, 1080.000000000000000, 1180.000000000000000, 1240.000000000000000,
            1240.000000000000000, 1300.000000000000000, 1360.000000000000000, 1420.000000000000000, 1480.000000000000000,
            1540.000000000000000, 1600.000000000000000, 1660.000000000000000, 1720.000000000000000, 1780.000000000000000,
            1840.000000000000000, 1920.000000000000000, 1940.000000000000000, 2040.000000000000000, 2060.000000000000000,
            2140.000000000000000, 2200.000000000000000, 2280.000000000000000, 2360.000000000000000, 2420.000000000000000,
            2600.000000000000000, 2760.000000000000000, 2920.000000000000000, 2940.000000000000000, 3020.000000000000000,
            3020.000000000000000, 3080.000000000000000, 3100.000000000000000, 3260.000000000000000, 3380.000000000000000,
            3520.000000000000000, 3700.000000000000000, 3860.000000000000000, 3880.000000000000000, 4060.000000000000000,
            4180.000000000000000, 4360.000000000000000, 4600.000000000000000, 4680.000000000000000, 4880.000000000000000,
            5100.000000000000000, 5280.000000000000000, 5520.000000000000000, 5780.000000000000000, 6000.000000000000000,
            6400.000000000000000, 6600.000000000000000, 6800.000000000000000, 7200.000000000000000, 7400.000000000000000,
            10200.000000000000000, 13000.000000000000000, 15600.000000000000000, 19400.000000000000000, 24000.000000000000000,
            27600.000000000000000, 28800.000000000000000, 30000.000000000000000, 31000.000000000000000, 32000.000000000000000,
            32000.000000000000000, 32000.000000000000000, 32000.000000000000000, 32000.000000000000000, 32000.000000000000000,
        ],
    ];
    var class_base_stats_by_level = [
        [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        [
            [17, 10, 11, 8, 8],
            [19, 12, 12, 9, 9],
            [20, 12, 12, 10, 10],
            [21, 13, 13, 10, 10],
            [21, 13, 13, 10, 10],
            [21, 13, 13, 10, 10],
            [23, 14, 14, 11, 10],
            [24, 15, 15, 12, 11],
            [26, 16, 16, 12, 12],
            [27, 17, 17, 13, 12],
            [30, 18, 18, 14, 14],
            [33, 20, 20, 16, 15],
            [35, 21, 22, 17, 16],
            [38, 24, 24, 18, 17],
            [41, 25, 25, 20, 19],
            [44, 27, 27, 21, 20],
            [47, 28, 29, 23, 22],
            [51, 31, 31, 25, 23],
            [54, 33, 33, 26, 25],
            [56, 35, 35, 27, 26],
            [59, 36, 36, 29, 28],
            [63, 39, 39, 31, 30],
            [66, 40, 41, 32, 30],
            [70, 43, 43, 34, 33],
            [73, 45, 45, 35, 34],
            [76, 46, 47, 37, 36],
            [79, 48, 48, 38, 36],
            [83, 51, 51, 40, 38],
            [86, 53, 53, 42, 40],
            [88, 54, 54, 43, 41],
            [91, 56, 56, 44, 43],
            [94, 57, 58, 46, 43],
            [97, 60, 59, 47, 45],
            [102, 62, 63, 50, 48],
            [105, 64, 64, 51, 49],
            [108, 66, 66, 53, 50],
            [111, 68, 68, 54, 51],
            [114, 69, 70, 55, 53],
            [116, 71, 71, 57, 54],
            [121, 73, 74, 59, 56],
            [123, 75, 76, 60, 57],
            [126, 77, 77, 61, 59],
            [129, 79, 79, 63, 60],
            [132, 80, 81, 64, 62],
            [136, 83, 83, 66, 63],
            [140, 86, 86, 68, 65],
            [143, 87, 88, 70, 67],
            [146, 89, 89, 71, 68],
            [148, 91, 91, 72, 69],
            [151, 93, 93, 74, 70],
            [154, 94, 94, 75, 72],
            [158, 97, 97, 77, 74],
            [161, 98, 99, 78, 75],
            [164, 100, 100, 80, 76],
            [167, 102, 102, 81, 77],
            [171, 105, 105, 83, 80],
            [174, 106, 106, 85, 81],
            [176, 108, 108, 86, 82],
            [179, 109, 110, 87, 83],
            [183, 112, 112, 89, 85],
            [196, 120, 120, 96, 91],
            [208, 127, 128, 102, 97],
            [221, 135, 135, 108, 103],
            [224, 137, 137, 109, 104],
            [228, 139, 140, 111, 106],
            [231, 141, 141, 113, 108],
            [234, 143, 143, 114, 109],
            [236, 145, 145, 115, 110],
            [239, 146, 146, 117, 111],
            [252, 154, 154, 123, 117],
            [259, 158, 158, 126, 121],
            [271, 166, 166, 132, 127],
            [284, 174, 174, 139, 132],
            [287, 175, 175, 140, 134],
            [289, 177, 177, 141, 135],
            [292, 179, 179, 143, 136],
            [296, 181, 181, 145, 138],
            [299, 183, 183, 146, 140],
            [303, 186, 186, 148, 142],
            [309, 189, 189, 151, 144],
            [322, 197, 197, 157, 150],
            [334, 204, 204, 163, 155],
            [341, 208, 209, 167, 159],
            [344, 211, 210, 168, 161],
            [347, 212, 212, 169, 161],
            [359, 220, 220, 175, 168],
            [372, 227, 227, 182, 174],
            [384, 235, 235, 188, 179],
            [397, 242, 243, 194, 185],
            [409, 250, 250, 200, 191],
            [560, 343, 343, 274, 261],
            [662, 405, 405, 324, 309],
            [775, 474, 474, 379, 361],
            [908, 555, 555, 444, 424],
            [1066, 652, 652, 521, 497],
            [1254, 767, 767, 613, 585],
            [1304, 797, 797, 638, 609],
            [1355, 828, 828, 662, 632],
            [1405, 859, 859, 687, 655],
            [1455, 889, 890, 711, 679],
        ],
        [
            [17, 5, 11, 12, 9],
            [19, 6, 12, 13, 10],
            [20, 6, 12, 14, 11],
            [21, 7, 13, 15, 11],
            [21, 7, 13, 15, 11],
            [21, 7, 13, 15, 11],
            [23, 7, 14, 16, 12],
            [24, 7, 15, 17, 13],
            [26, 8, 16, 18, 14],
            [27, 9, 17, 19, 14],
            [30, 9, 18, 21, 16],
            [33, 10, 20, 23, 17],
            [35, 11, 22, 25, 19],
            [38, 12, 24, 27, 20],
            [41, 13, 25, 29, 22],
            [44, 14, 27, 31, 23],
            [47, 15, 29, 33, 25],
            [51, 16, 31, 36, 27],
            [54, 17, 33, 38, 29],
            [56, 18, 35, 40, 30],
            [59, 18, 36, 42, 32],
            [63, 20, 39, 45, 34],
            [66, 21, 41, 47, 35],
            [70, 22, 43, 50, 38],
            [73, 23, 45, 52, 39],
            [76, 24, 47, 54, 41],
            [79, 24, 48, 56, 42],
            [83, 26, 51, 59, 44],
            [86, 27, 53, 61, 46],
            [88, 28, 54, 63, 47],
            [91, 29, 56, 65, 49],
            [94, 29, 58, 67, 50],
            [97, 30, 59, 69, 52],
            [102, 32, 63, 73, 55],
            [105, 33, 64, 75, 56],
            [108, 34, 66, 77, 58],
            [111, 35, 68, 79, 59],
            [114, 35, 70, 81, 61],
            [116, 37, 71, 83, 62],
            [121, 38, 74, 86, 65],
            [123, 39, 76, 88, 66],
            [126, 39, 77, 90, 68],
            [129, 40, 79, 92, 69],
            [132, 41, 81, 94, 71],
            [136, 43, 83, 97, 73],
            [140, 44, 86, 100, 75],
            [143, 45, 88, 102, 77],
            [146, 46, 89, 104, 78],
            [148, 46, 91, 106, 80],
            [151, 48, 93, 108, 81],
            [154, 48, 94, 110, 83],
            [158, 50, 97, 113, 85],
            [161, 50, 99, 115, 86],
            [164, 51, 100, 117, 88],
            [167, 52, 102, 119, 89],
            [171, 54, 105, 122, 92],
            [174, 54, 106, 124, 93],
            [176, 55, 108, 126, 95],
            [179, 56, 110, 128, 96],
            [183, 57, 112, 131, 98],
            [196, 61, 120, 140, 105],
            [208, 65, 128, 149, 112],
            [221, 69, 135, 158, 119],
            [224, 70, 137, 160, 120],
            [228, 71, 140, 163, 122],
            [231, 72, 141, 165, 124],
            [234, 73, 143, 167, 125],
            [236, 74, 145, 169, 127],
            [239, 75, 146, 171, 128],
            [252, 79, 154, 180, 135],
            [259, 81, 158, 185, 139],
            [271, 85, 166, 194, 146],
            [284, 89, 174, 203, 152],
            [287, 90, 175, 205, 154],
            [289, 91, 177, 207, 155],
            [292, 91, 179, 209, 157],
            [296, 93, 181, 212, 159],
            [299, 94, 183, 214, 161],
            [303, 95, 186, 217, 163],
            [309, 97, 189, 221, 166],
            [322, 101, 197, 230, 173],
            [334, 105, 204, 239, 179],
            [341, 107, 209, 244, 183],
            [344, 108, 210, 246, 185],
            [347, 108, 212, 248, 186],
            [359, 112, 220, 257, 193],
            [372, 116, 227, 266, 200],
            [384, 120, 235, 275, 206],
            [397, 124, 243, 284, 213],
            [409, 128, 250, 293, 220],
            [560, 176, 343, 401, 301],
            [662, 207, 405, 474, 356],
            [775, 243, 474, 555, 416],
            [908, 284, 555, 650, 488],
            [1066, 334, 652, 763, 572],
            [1254, 393, 767, 898, 674],
            [1304, 408, 797, 934, 701],
            [1355, 424, 828, 970, 728],
            [1405, 440, 859, 1006, 755],
            [1455, 455, 890, 1042, 782],
        ],
        [
            [10, 15, 11, 10, 8],
            [12, 17, 12, 11, 9],
            [12, 18, 12, 11, 10],
            [13, 19, 13, 12, 10],
            [13, 19, 13, 12, 10],
            [13, 19, 13, 12, 10],
            [14, 20, 14, 13, 11],
            [15, 21, 15, 14, 12],
            [16, 23, 16, 15, 13],
            [16, 24, 17, 16, 13],
            [18, 26, 18, 17, 15],
            [20, 29, 20, 19, 15],
            [21, 31, 22, 20, 17],
            [23, 34, 24, 22, 18],
            [25, 36, 25, 24, 20],
            [27, 39, 27, 25, 21],
            [29, 41, 29, 27, 23],
            [31, 45, 31, 29, 25],
            [33, 47, 33, 31, 26],
            [34, 50, 35, 33, 27],
            [36, 52, 36, 34, 29],
            [38, 56, 39, 37, 31],
            [40, 58, 41, 38, 32],
            [43, 62, 43, 41, 35],
            [44, 65, 45, 43, 35],
            [46, 67, 47, 44, 37],
            [48, 69, 48, 46, 38],
            [51, 73, 51, 48, 40],
            [52, 76, 53, 50, 42],
            [54, 78, 54, 52, 43],
            [55, 81, 56, 53, 45],
            [57, 83, 58, 55, 45],
            [59, 86, 59, 57, 47],
            [62, 90, 63, 60, 50],
            [64, 93, 64, 61, 51],
            [66, 95, 66, 63, 53],
            [68, 98, 68, 65, 54],
            [69, 100, 70, 66, 55],
            [71, 103, 71, 68, 56],
            [74, 106, 74, 70, 59],
            [75, 109, 76, 72, 60],
            [77, 111, 77, 74, 62],
            [79, 114, 79, 75, 63],
            [80, 116, 81, 77, 65],
            [83, 120, 83, 79, 66],
            [85, 124, 86, 82, 68],
            [87, 126, 88, 84, 70],
            [89, 129, 89, 85, 71],
            [90, 131, 91, 87, 73],
            [92, 134, 93, 88, 74],
            [94, 136, 94, 90, 75],
            [96, 140, 97, 93, 77],
            [98, 142, 99, 94, 78],
            [100, 145, 100, 96, 80],
            [102, 147, 102, 97, 81],
            [104, 151, 105, 100, 84],
            [106, 153, 106, 102, 85],
            [107, 156, 108, 103, 86],
            [109, 158, 110, 105, 87],
            [111, 162, 112, 107, 89],
            [119, 173, 120, 115, 95],
            [127, 184, 128, 122, 102],
            [135, 195, 135, 129, 108],
            [136, 198, 137, 131, 109],
            [139, 201, 140, 134, 111],
            [141, 204, 141, 135, 113],
            [142, 206, 143, 137, 114],
            [144, 209, 145, 138, 115],
            [146, 211, 146, 140, 116],
            [153, 222, 154, 147, 123],
            [158, 228, 158, 152, 126],
            [165, 240, 166, 159, 133],
            [173, 251, 174, 166, 138],
            [175, 253, 175, 168, 140],
            [176, 256, 177, 170, 141],
            [178, 258, 179, 171, 143],
            [180, 262, 181, 174, 145],
            [182, 264, 183, 175, 146],
            [184, 268, 186, 178, 148],
            [188, 273, 189, 181, 151],
            [196, 284, 197, 188, 157],
            [203, 295, 204, 196, 163],
            [208, 301, 209, 200, 166],
            [209, 304, 210, 202, 168],
            [211, 306, 212, 203, 169],
            [219, 317, 220, 211, 175],
            [226, 328, 227, 218, 182],
            [234, 339, 235, 225, 187],
            [242, 350, 243, 233, 194],
            [249, 361, 250, 240, 200],
            [341, 495, 343, 328, 274],
            [403, 585, 405, 388, 324],
            [472, 684, 474, 455, 378],
            [553, 801, 555, 532, 444],
            [649, 941, 652, 625, 520],
            [763, 1107, 767, 736, 613],
            [794, 1151, 797, 765, 637],
            [825, 1196, 828, 795, 662],
            [855, 1240, 859, 824, 686],
            [886, 1284, 890, 854, 711],
        ],
        [
            [14, 15, 11, 8, 6],
            [16, 17, 12, 9, 7],
            [17, 18, 12, 10, 8],
            [17, 19, 13, 10, 8],
            [17, 19, 13, 10, 8],
            [17, 19, 13, 10, 8],
            [19, 20, 14, 11, 8],
            [20, 21, 15, 12, 9],
            [22, 23, 16, 12, 10],
            [22, 24, 17, 13, 10],
            [25, 26, 18, 14, 11],
            [27, 29, 20, 16, 12],
            [29, 31, 22, 17, 13],
            [31, 34, 24, 18, 14],
            [34, 36, 25, 20, 15],
            [36, 39, 27, 21, 16],
            [39, 41, 29, 23, 17],
            [42, 45, 31, 25, 18],
            [45, 47, 33, 26, 20],
            [46, 50, 35, 27, 20],
            [49, 52, 36, 29, 22],
            [52, 56, 39, 31, 23],
            [55, 58, 41, 32, 24],
            [58, 62, 43, 34, 26],
            [61, 65, 45, 35, 27],
            [63, 67, 47, 37, 28],
            [65, 69, 48, 38, 29],
            [69, 73, 51, 40, 30],
            [71, 76, 53, 42, 31],
            [73, 78, 54, 43, 32],
            [75, 81, 56, 44, 33],
            [78, 83, 58, 46, 34],
            [80, 86, 59, 47, 35],
            [85, 90, 63, 50, 38],
            [87, 93, 64, 51, 38],
            [90, 95, 66, 53, 40],
            [92, 98, 68, 54, 40],
            [94, 100, 70, 55, 42],
            [96, 103, 71, 57, 42],
            [100, 106, 74, 59, 44],
            [102, 109, 76, 60, 45],
            [104, 111, 77, 61, 46],
            [107, 114, 79, 63, 47],
            [109, 116, 81, 64, 48],
            [113, 120, 83, 66, 50],
            [116, 124, 86, 68, 51],
            [119, 126, 88, 70, 53],
            [121, 129, 89, 71, 53],
            [123, 131, 91, 72, 55],
            [125, 134, 93, 74, 55],
            [128, 136, 94, 75, 57],
            [131, 140, 97, 77, 58],
            [133, 142, 99, 78, 59],
            [136, 145, 100, 80, 60],
            [138, 147, 102, 81, 61],
            [142, 151, 105, 83, 63],
            [144, 153, 106, 85, 63],
            [146, 156, 108, 86, 65],
            [148, 158, 110, 87, 65],
            [152, 162, 112, 89, 67],
            [162, 173, 120, 96, 72],
            [172, 184, 128, 102, 76],
            [183, 195, 135, 108, 81],
            [186, 198, 137, 109, 82],
            [189, 201, 140, 111, 83],
            [191, 204, 141, 113, 85],
            [194, 206, 143, 114, 85],
            [196, 209, 145, 115, 87],
            [198, 211, 146, 117, 87],
            [209, 222, 154, 123, 92],
            [215, 228, 158, 126, 95],
            [225, 240, 166, 132, 100],
            [235, 251, 174, 139, 104],
            [238, 253, 175, 140, 105],
            [240, 256, 177, 141, 106],
            [242, 258, 179, 143, 107],
            [245, 262, 181, 145, 108],
            [248, 264, 183, 146, 110],
            [251, 268, 186, 148, 111],
            [256, 273, 189, 151, 113],
            [267, 284, 197, 157, 118],
            [277, 295, 204, 163, 122],
            [283, 301, 209, 167, 125],
            [285, 304, 210, 168, 126],
            [288, 306, 212, 169, 127],
            [298, 317, 220, 175, 132],
            [308, 328, 227, 182, 136],
            [318, 339, 235, 188, 140],
            [329, 350, 243, 194, 145],
            [339, 361, 250, 200, 150],
            [464, 495, 343, 274, 205],
            [549, 585, 405, 324, 243],
            [642, 684, 474, 379, 284],
            [753, 801, 555, 444, 333],
            [884, 941, 652, 521, 390],
            [1039, 1107, 767, 613, 460],
            [1081, 1151, 797, 638, 478],
            [1123, 1196, 828, 662, 496],
            [1165, 1240, 859, 687, 515],
            [1206, 1284, 890, 711, 533],
        ],
        [
            [10, 12, 11, 12, 9],
            [11, 14, 12, 13, 10],
            [12, 15, 12, 14, 11],
            [12, 16, 13, 15, 11],
            [12, 16, 13, 15, 11],
            [12, 16, 13, 15, 11],
            [13, 17, 14, 16, 12],
            [14, 17, 15, 17, 13],
            [15, 19, 16, 18, 14],
            [16, 20, 17, 19, 14],
            [17, 22, 18, 21, 16],
            [19, 24, 20, 23, 17],
            [20, 26, 22, 25, 19],
            [22, 28, 24, 27, 20],
            [24, 30, 25, 29, 22],
            [25, 32, 27, 31, 23],
            [27, 34, 29, 33, 25],
            [30, 37, 31, 36, 27],
            [31, 39, 33, 38, 29],
            [32, 42, 35, 40, 30],
            [34, 43, 36, 42, 32],
            [37, 47, 39, 45, 34],
            [38, 48, 41, 47, 35],
            [41, 52, 43, 50, 38],
            [42, 54, 45, 52, 39],
            [44, 56, 47, 54, 41],
            [46, 57, 48, 56, 42],
            [48, 61, 51, 59, 44],
            [50, 63, 53, 61, 46],
            [51, 65, 54, 63, 47],
            [53, 67, 56, 65, 49],
            [54, 69, 58, 67, 50],
            [56, 71, 59, 69, 52],
            [59, 75, 63, 73, 55],
            [61, 77, 64, 75, 56],
            [63, 79, 66, 77, 58],
            [64, 81, 68, 79, 59],
            [66, 83, 70, 81, 61],
            [67, 86, 71, 83, 62],
            [70, 88, 74, 86, 65],
            [71, 91, 76, 88, 66],
            [73, 92, 77, 90, 68],
            [75, 95, 79, 92, 69],
            [76, 96, 81, 94, 71],
            [79, 100, 83, 97, 73],
            [81, 103, 86, 100, 75],
            [83, 105, 88, 102, 77],
            [85, 107, 89, 104, 78],
            [86, 109, 91, 106, 80],
            [87, 111, 93, 108, 81],
            [89, 113, 94, 110, 83],
            [92, 116, 97, 113, 85],
            [93, 118, 99, 115, 86],
            [95, 120, 100, 117, 88],
            [97, 122, 102, 119, 89],
            [99, 125, 105, 122, 92],
            [101, 127, 106, 124, 93],
            [102, 130, 108, 126, 95],
            [104, 131, 110, 128, 96],
            [106, 135, 112, 131, 98],
            [114, 144, 120, 140, 105],
            [121, 153, 128, 149, 112],
            [128, 162, 135, 158, 119],
            [130, 165, 137, 160, 120],
            [132, 167, 140, 163, 122],
            [134, 170, 141, 165, 124],
            [136, 171, 143, 167, 125],
            [137, 174, 145, 169, 127],
            [138, 175, 146, 171, 128],
            [146, 184, 154, 180, 135],
            [150, 189, 158, 185, 139],
            [157, 199, 166, 194, 146],
            [165, 209, 174, 203, 152],
            [166, 210, 175, 205, 154],
            [167, 213, 177, 207, 155],
            [169, 214, 179, 209, 157],
            [172, 218, 181, 212, 159],
            [173, 219, 183, 214, 161],
            [176, 223, 186, 217, 163],
            [179, 227, 189, 221, 166],
            [187, 236, 197, 230, 173],
            [194, 245, 204, 239, 179],
            [198, 250, 209, 244, 183],
            [199, 253, 210, 246, 185],
            [201, 254, 212, 248, 186],
            [208, 263, 220, 257, 193],
            [216, 273, 227, 266, 200],
            [223, 282, 235, 275, 206],
            [230, 291, 243, 284, 213],
            [237, 300, 250, 293, 220],
            [324, 411, 343, 401, 301],
            [384, 486, 405, 474, 356],
            [449, 568, 474, 555, 416],
            [526, 666, 555, 650, 488],
            [618, 782, 652, 763, 572],
            [727, 920, 767, 898, 674],
            [756, 957, 797, 934, 701],
            [785, 994, 828, 970, 728],
            [814, 1030, 859, 1006, 755],
            [843, 1067, 890, 1042, 782],
        ],
        [
            [17, 13, 11, 7, 7],
            [19, 14, 12, 7, 8],
            [20, 15, 12, 8, 9],
            [21, 16, 13, 8, 9],
            [21, 16, 13, 8, 9],
            [21, 16, 13, 8, 9],
            [23, 17, 14, 9, 10],
            [24, 18, 15, 9, 11],
            [26, 19, 16, 10, 11],
            [27, 20, 17, 10, 11],
            [30, 22, 18, 11, 13],
            [33, 24, 20, 13, 14],
            [35, 26, 22, 14, 16],
            [38, 28, 24, 15, 16],
            [41, 30, 25, 16, 18],
            [44, 33, 27, 17, 19],
            [47, 34, 29, 18, 20],
            [51, 38, 31, 20, 22],
            [54, 39, 33, 21, 24],
            [56, 42, 35, 22, 25],
            [59, 43, 36, 23, 26],
            [63, 47, 39, 25, 28],
            [66, 48, 41, 26, 29],
            [70, 52, 43, 27, 31],
            [73, 54, 45, 28, 32],
            [76, 56, 47, 29, 34],
            [79, 58, 48, 31, 34],
            [83, 61, 51, 32, 36],
            [86, 63, 53, 33, 38],
            [88, 65, 54, 34, 38],
            [91, 68, 56, 35, 40],
            [94, 69, 58, 37, 41],
            [97, 72, 59, 38, 43],
            [102, 75, 63, 40, 45],
            [105, 78, 64, 41, 46],
            [108, 79, 66, 42, 47],
            [111, 82, 68, 43, 48],
            [114, 83, 70, 44, 50],
            [116, 86, 71, 45, 51],
            [121, 88, 74, 47, 53],
            [123, 91, 76, 48, 54],
            [126, 93, 77, 49, 56],
            [129, 95, 79, 50, 56],
            [132, 97, 81, 51, 58],
            [136, 100, 83, 53, 60],
            [140, 103, 86, 55, 61],
            [143, 105, 88, 56, 63],
            [146, 108, 89, 57, 64],
            [148, 109, 91, 58, 65],
            [151, 112, 93, 59, 66],
            [154, 113, 94, 60, 68],
            [158, 117, 97, 62, 70],
            [161, 118, 99, 63, 70],
            [164, 121, 100, 64, 72],
            [167, 123, 102, 65, 73],
            [171, 126, 105, 67, 75],
            [174, 128, 106, 68, 76],
            [176, 130, 108, 69, 78],
            [179, 132, 110, 70, 79],
            [183, 135, 112, 72, 80],
            [196, 144, 120, 76, 86],
            [208, 153, 128, 81, 92],
            [221, 163, 135, 86, 97],
            [224, 165, 137, 87, 98],
            [228, 168, 140, 89, 100],
            [231, 170, 141, 90, 101],
            [234, 172, 143, 91, 102],
            [236, 174, 145, 92, 104],
            [239, 176, 146, 93, 105],
            [252, 185, 154, 98, 110],
            [259, 190, 158, 101, 114],
            [271, 200, 166, 106, 119],
            [284, 209, 174, 111, 124],
            [287, 211, 175, 112, 126],
            [289, 213, 177, 113, 127],
            [292, 215, 179, 114, 128],
            [296, 218, 181, 116, 130],
            [299, 220, 183, 117, 132],
            [303, 223, 186, 118, 133],
            [309, 228, 189, 121, 136],
            [322, 237, 197, 126, 142],
            [334, 246, 204, 131, 146],
            [341, 251, 209, 133, 150],
            [344, 253, 210, 134, 151],
            [347, 255, 212, 135, 152],
            [359, 264, 220, 140, 158],
            [372, 273, 227, 145, 164],
            [384, 283, 235, 150, 169],
            [397, 292, 243, 155, 174],
            [409, 301, 250, 160, 180],
            [560, 413, 343, 219, 246],
            [662, 488, 405, 259, 291],
            [775, 570, 474, 303, 340],
            [908, 668, 555, 355, 399],
            [1066, 785, 652, 417, 468],
            [1254, 923, 767, 490, 551],
            [1304, 960, 797, 510, 574],
            [1355, 997, 828, 530, 596],
            [1405, 1034, 859, 549, 618],
            [1455, 1071, 890, 569, 640],
        ],
        [
            [7, 15, 11, 12, 9],
            [8, 17, 12, 13, 10],
            [9, 18, 12, 14, 11],
            [9, 19, 13, 15, 11],
            [9, 19, 13, 15, 11],
            [9, 19, 13, 15, 11],
            [10, 20, 14, 16, 12],
            [10, 21, 15, 17, 13],
            [11, 23, 16, 18, 14],
            [12, 24, 17, 19, 14],
            [13, 26, 18, 21, 16],
            [14, 29, 20, 23, 17],
            [15, 31, 22, 25, 19],
            [16, 34, 24, 27, 20],
            [18, 36, 25, 29, 22],
            [19, 39, 27, 31, 23],
            [20, 41, 29, 33, 25],
            [22, 45, 31, 36, 27],
            [23, 47, 33, 38, 29],
            [24, 50, 35, 40, 30],
            [25, 52, 36, 42, 32],
            [27, 56, 39, 45, 34],
            [28, 58, 41, 47, 35],
            [30, 62, 43, 50, 38],
            [31, 65, 45, 52, 39],
            [33, 67, 47, 54, 41],
            [34, 69, 48, 56, 42],
            [36, 73, 51, 59, 44],
            [37, 76, 53, 61, 46],
            [38, 78, 54, 63, 47],
            [39, 81, 56, 65, 49],
            [40, 83, 58, 67, 50],
            [42, 86, 59, 69, 52],
            [44, 90, 63, 73, 55],
            [45, 93, 64, 75, 56],
            [46, 95, 66, 77, 58],
            [48, 98, 68, 79, 59],
            [49, 100, 70, 81, 61],
            [50, 103, 71, 83, 62],
            [52, 106, 74, 86, 65],
            [53, 109, 76, 88, 66],
            [54, 111, 77, 90, 68],
            [56, 114, 79, 92, 69],
            [57, 116, 81, 94, 71],
            [59, 120, 83, 97, 73],
            [60, 124, 86, 100, 75],
            [62, 126, 88, 102, 77],
            [63, 129, 89, 104, 78],
            [64, 131, 91, 106, 80],
            [65, 134, 93, 108, 81],
            [66, 136, 94, 110, 83],
            [68, 140, 97, 113, 85],
            [69, 142, 99, 115, 86],
            [71, 145, 100, 117, 88],
            [72, 147, 102, 119, 89],
            [74, 151, 105, 122, 92],
            [75, 153, 106, 124, 93],
            [76, 156, 108, 126, 95],
            [77, 158, 110, 128, 96],
            [79, 162, 112, 131, 98],
            [84, 173, 120, 140, 105],
            [90, 184, 128, 149, 112],
            [95, 195, 135, 158, 119],
            [96, 198, 137, 160, 120],
            [98, 201, 140, 163, 122],
            [99, 204, 141, 165, 124],
            [101, 206, 143, 167, 125],
            [102, 209, 145, 169, 127],
            [103, 211, 146, 171, 128],
            [108, 222, 154, 180, 135],
            [111, 228, 158, 185, 139],
            [117, 240, 166, 194, 146],
            [122, 251, 174, 203, 152],
            [124, 253, 175, 205, 154],
            [124, 256, 177, 207, 155],
            [126, 258, 179, 209, 157],
            [127, 262, 181, 212, 159],
            [129, 264, 183, 214, 161],
            [130, 268, 186, 217, 163],
            [133, 273, 189, 221, 166],
            [139, 284, 197, 230, 173],
            [144, 295, 204, 239, 179],
            [147, 301, 209, 244, 183],
            [148, 304, 210, 246, 185],
            [149, 306, 212, 248, 186],
            [154, 317, 220, 257, 193],
            [160, 328, 227, 266, 200],
            [165, 339, 235, 275, 206],
            [171, 350, 243, 284, 213],
            [176, 361, 250, 293, 220],
            [241, 495, 343, 401, 301],
            [285, 585, 405, 474, 356],
            [333, 684, 474, 555, 416],
            [391, 801, 555, 650, 488],
            [459, 941, 652, 763, 572],
            [540, 1107, 767, 898, 674],
            [561, 1151, 797, 934, 701],
            [583, 1196, 828, 970, 728],
            [605, 1240, 859, 1006, 755],
            [626, 1284, 890, 1042, 782],
        ],
        [
            [8, 10, 11, 12, 13],
            [8, 12, 12, 13, 15],
            [9, 12, 12, 14, 16],
            [9, 13, 13, 15, 16],
            [9, 13, 13, 15, 16],
            [9, 13, 13, 15, 16],
            [10, 14, 14, 16, 18],
            [11, 15, 15, 17, 19],
            [12, 16, 16, 18, 21],
            [12, 17, 17, 19, 21],
            [13, 18, 18, 21, 24],
            [15, 20, 20, 23, 25],
            [16, 21, 22, 25, 28],
            [17, 24, 24, 27, 30],
            [18, 25, 25, 29, 33],
            [20, 27, 27, 31, 34],
            [21, 28, 29, 33, 37],
            [23, 31, 31, 36, 40],
            [24, 33, 33, 38, 43],
            [25, 35, 35, 40, 44],
            [26, 36, 36, 42, 47],
            [28, 39, 39, 45, 50],
            [29, 40, 41, 47, 52],
            [31, 43, 43, 50, 56],
            [32, 45, 45, 52, 58],
            [34, 46, 47, 54, 61],
            [35, 48, 48, 56, 62],
            [37, 51, 51, 59, 65],
            [38, 53, 53, 61, 68],
            [39, 54, 54, 63, 69],
            [40, 56, 56, 65, 72],
            [42, 57, 58, 67, 74],
            [43, 60, 59, 69, 77],
            [45, 62, 63, 73, 81],
            [47, 64, 64, 75, 83],
            [48, 66, 66, 77, 86],
            [49, 68, 68, 79, 87],
            [51, 69, 70, 81, 90],
            [52, 71, 71, 83, 92],
            [54, 73, 74, 86, 96],
            [55, 75, 76, 88, 98],
            [56, 77, 77, 90, 100],
            [57, 79, 79, 92, 102],
            [59, 80, 81, 94, 105],
            [61, 83, 83, 97, 108],
            [62, 86, 86, 100, 111],
            [64, 87, 88, 102, 114],
            [65, 89, 89, 104, 115],
            [66, 91, 91, 106, 118],
            [67, 93, 93, 108, 120],
            [69, 94, 94, 110, 123],
            [70, 97, 97, 113, 126],
            [72, 98, 99, 115, 127],
            [73, 100, 100, 117, 130],
            [74, 102, 102, 119, 131],
            [76, 105, 105, 122, 136],
            [77, 106, 106, 124, 137],
            [78, 108, 108, 126, 140],
            [80, 109, 110, 128, 142],
            [81, 112, 112, 131, 145],
            [87, 120, 120, 140, 155],
            [93, 127, 128, 149, 165],
            [98, 135, 135, 158, 176],
            [100, 137, 137, 160, 177],
            [101, 139, 140, 163, 180],
            [103, 141, 141, 165, 183],
            [104, 143, 143, 167, 185],
            [105, 145, 145, 169, 188],
            [106, 146, 146, 171, 189],
            [112, 154, 154, 180, 199],
            [115, 158, 158, 185, 205],
            [121, 166, 166, 194, 216],
            [126, 174, 174, 203, 225],
            [128, 175, 175, 205, 228],
            [129, 177, 177, 207, 229],
            [130, 179, 179, 209, 232],
            [132, 181, 181, 212, 235],
            [133, 183, 183, 214, 238],
            [135, 186, 186, 217, 241],
            [138, 189, 189, 221, 245],
            [143, 197, 197, 230, 256],
            [149, 204, 204, 239, 264],
            [152, 208, 209, 244, 270],
            [153, 211, 210, 246, 273],
            [154, 212, 212, 248, 275],
            [160, 220, 220, 257, 285],
            [166, 227, 227, 266, 295],
            [171, 235, 235, 275, 304],
            [177, 242, 243, 284, 315],
            [182, 250, 250, 293, 325],
            [249, 343, 343, 401, 445],
            [295, 405, 405, 474, 526],
            [345, 474, 474, 555, 615],
            [404, 555, 555, 650, 721],
            [474, 652, 652, 763, 845],
            [558, 767, 767, 898, 996],
            [580, 797, 797, 934, 1036],
            [603, 828, 828, 970, 1075],
            [625, 859, 859, 1006, 1115],
            [647, 889, 890, 1042, 1155],
        ],
        [
            [6, 12, 11, 12, 13],
            [7, 13, 12, 13, 15],
            [8, 14, 12, 14, 16],
            [8, 15, 13, 15, 16],
            [8, 15, 13, 15, 16],
            [8, 15, 13, 15, 16],
            [9, 15, 14, 16, 18],
            [9, 16, 15, 17, 19],
            [10, 18, 16, 18, 21],
            [10, 18, 17, 19, 21],
            [11, 20, 18, 21, 24],
            [13, 22, 20, 23, 25],
            [13, 24, 22, 25, 28],
            [14, 26, 24, 27, 30],
            [16, 28, 25, 29, 33],
            [17, 30, 27, 31, 34],
            [18, 31, 29, 33, 37],
            [19, 35, 31, 36, 40],
            [20, 36, 33, 38, 43],
            [21, 38, 35, 40, 44],
            [22, 40, 36, 42, 47],
            [24, 43, 39, 45, 50],
            [25, 45, 41, 47, 52],
            [27, 48, 43, 50, 56],
            [28, 50, 45, 52, 58],
            [29, 51, 47, 54, 61],
            [30, 53, 48, 56, 62],
            [31, 56, 51, 59, 65],
            [33, 58, 53, 61, 68],
            [33, 60, 54, 63, 69],
            [34, 62, 56, 65, 72],
            [36, 64, 58, 67, 74],
            [37, 66, 59, 69, 77],
            [39, 69, 63, 73, 81],
            [40, 71, 64, 75, 83],
            [41, 73, 66, 77, 86],
            [42, 75, 68, 79, 87],
            [43, 77, 70, 81, 90],
            [44, 79, 71, 83, 92],
            [46, 81, 74, 86, 96],
            [47, 84, 76, 88, 98],
            [48, 85, 77, 90, 100],
            [49, 87, 79, 92, 102],
            [50, 89, 81, 94, 105],
            [52, 92, 83, 97, 108],
            [53, 95, 86, 100, 111],
            [54, 97, 88, 102, 114],
            [55, 99, 89, 104, 115],
            [56, 101, 91, 106, 118],
            [57, 103, 93, 108, 120],
            [58, 104, 94, 110, 123],
            [60, 107, 97, 113, 126],
            [61, 109, 99, 115, 127],
            [62, 111, 100, 117, 130],
            [63, 113, 102, 119, 131],
            [65, 116, 105, 122, 136],
            [66, 117, 106, 124, 137],
            [67, 120, 108, 126, 140],
            [68, 121, 110, 128, 142],
            [69, 124, 112, 131, 145],
            [74, 133, 120, 140, 155],
            [79, 141, 128, 149, 165],
            [84, 150, 135, 158, 176],
            [85, 152, 137, 160, 177],
            [86, 154, 140, 163, 180],
            [88, 157, 141, 165, 183],
            [89, 158, 143, 167, 185],
            [89, 160, 145, 169, 188],
            [91, 162, 146, 171, 189],
            [96, 170, 154, 180, 199],
            [98, 175, 158, 185, 205],
            [103, 184, 166, 194, 216],
            [108, 193, 174, 203, 225],
            [109, 194, 175, 205, 228],
            [110, 196, 177, 207, 229],
            [111, 198, 179, 209, 232],
            [112, 201, 181, 212, 235],
            [113, 203, 183, 214, 238],
            [115, 206, 186, 217, 241],
            [117, 209, 189, 221, 245],
            [122, 218, 197, 230, 256],
            [127, 226, 204, 239, 264],
            [129, 231, 209, 244, 270],
            [130, 233, 210, 246, 273],
            [132, 235, 212, 248, 275],
            [136, 243, 220, 257, 285],
            [141, 252, 227, 266, 295],
            [146, 260, 235, 275, 304],
            [150, 269, 243, 284, 315],
            [155, 277, 250, 293, 325],
            [212, 380, 343, 401, 445],
            [251, 449, 405, 474, 526],
            [294, 525, 474, 555, 615],
            [344, 615, 555, 650, 721],
            [404, 722, 652, 763, 845],
            [475, 849, 767, 898, 996],
            [494, 883, 797, 934, 1036],
            [514, 918, 828, 970, 1075],
            [532, 951, 859, 1006, 1115],
            [551, 985, 890, 1042, 1155],
        ],
        [
            [7, 15, 11, 12, 9],
            [8, 17, 12, 13, 10],
            [9, 18, 12, 14, 11],
            [9, 19, 13, 15, 11],
            [9, 19, 13, 15, 11],
            [9, 19, 13, 15, 11],
            [10, 20, 14, 16, 12],
            [10, 21, 15, 17, 13],
            [11, 23, 16, 18, 14],
            [12, 24, 17, 19, 14],
            [13, 26, 18, 21, 16],
            [14, 29, 20, 23, 17],
            [15, 31, 22, 25, 19],
            [16, 34, 24, 27, 20],
            [18, 36, 25, 29, 22],
            [19, 39, 27, 31, 23],
            [20, 41, 29, 33, 25],
            [22, 45, 31, 36, 27],
            [23, 47, 33, 38, 29],
            [24, 50, 35, 40, 30],
            [25, 52, 36, 42, 32],
            [27, 56, 39, 45, 34],
            [28, 58, 41, 47, 35],
            [30, 62, 43, 50, 38],
            [31, 65, 45, 52, 39],
            [33, 67, 47, 54, 41],
            [34, 69, 48, 56, 42],
            [36, 73, 51, 59, 44],
            [37, 76, 53, 61, 46],
            [38, 78, 54, 63, 47],
            [39, 81, 56, 65, 49],
            [40, 83, 58, 67, 50],
            [42, 86, 59, 69, 52],
            [44, 90, 63, 73, 55],
            [45, 93, 64, 75, 56],
            [46, 95, 66, 77, 58],
            [48, 98, 68, 79, 59],
            [49, 100, 70, 81, 61],
            [50, 103, 71, 83, 62],
            [52, 106, 74, 86, 65],
            [53, 109, 76, 88, 66],
            [54, 111, 77, 90, 68],
            [56, 114, 79, 92, 69],
            [57, 116, 81, 94, 71],
            [59, 120, 83, 97, 73],
            [60, 124, 86, 100, 75],
            [62, 126, 88, 102, 77],
            [63, 129, 89, 104, 78],
            [64, 131, 91, 106, 80],
            [65, 134, 93, 108, 81],
            [66, 136, 94, 110, 83],
            [68, 140, 97, 113, 85],
            [69, 142, 99, 115, 86],
            [71, 145, 100, 117, 88],
            [72, 147, 102, 119, 89],
            [74, 151, 105, 122, 92],
            [75, 153, 106, 124, 93],
            [76, 156, 108, 126, 95],
            [77, 158, 110, 128, 96],
            [79, 162, 112, 131, 98],
            [84, 173, 120, 140, 105],
            [90, 184, 128, 149, 112],
            [95, 195, 135, 158, 119],
            [96, 198, 137, 160, 120],
            [98, 201, 140, 163, 122],
            [99, 204, 141, 165, 124],
            [101, 206, 143, 167, 125],
            [102, 209, 145, 169, 127],
            [103, 211, 146, 171, 128],
            [108, 222, 154, 180, 135],
            [111, 228, 158, 185, 139],
            [117, 240, 166, 194, 146],
            [122, 251, 174, 203, 152],
            [124, 253, 175, 205, 154],
            [124, 256, 177, 207, 155],
            [126, 258, 179, 209, 157],
            [127, 262, 181, 212, 159],
            [129, 264, 183, 214, 161],
            [130, 268, 186, 217, 163],
            [133, 273, 189, 221, 166],
            [139, 284, 197, 230, 173],
            [144, 295, 204, 239, 179],
            [147, 301, 209, 244, 183],
            [148, 304, 210, 246, 185],
            [149, 306, 212, 248, 186],
            [154, 317, 220, 257, 193],
            [160, 328, 227, 266, 200],
            [165, 339, 235, 275, 206],
            [171, 350, 243, 284, 213],
            [176, 361, 250, 293, 220],
            [241, 495, 343, 401, 301],
            [285, 585, 405, 474, 356],
            [333, 684, 474, 555, 416],
            [391, 801, 555, 650, 488],
            [459, 941, 652, 763, 572],
            [540, 1107, 767, 898, 674],
            [561, 1151, 797, 934, 701],
            [583, 1196, 828, 970, 728],
            [605, 1240, 859, 1006, 755],
            [626, 1284, 890, 1042, 782],
        ],
        [
            [7, 15, 11, 12, 9],
            [8, 17, 12, 13, 10],
            [9, 18, 12, 14, 11],
            [9, 19, 13, 15, 11],
            [9, 19, 13, 15, 11],
            [9, 19, 13, 15, 11],
            [10, 20, 14, 16, 12],
            [10, 21, 15, 17, 13],
            [11, 23, 16, 18, 14],
            [12, 24, 17, 19, 14],
            [13, 26, 18, 21, 16],
            [14, 29, 20, 23, 17],
            [15, 31, 22, 25, 19],
            [16, 34, 24, 27, 20],
            [18, 36, 25, 29, 22],
            [19, 39, 27, 31, 23],
            [20, 41, 29, 33, 25],
            [22, 45, 31, 36, 27],
            [23, 47, 33, 38, 29],
            [24, 50, 35, 40, 30],
            [25, 52, 36, 42, 32],
            [27, 56, 39, 45, 34],
            [28, 58, 41, 47, 35],
            [30, 62, 43, 50, 38],
            [31, 65, 45, 52, 39],
            [33, 67, 47, 54, 41],
            [34, 69, 48, 56, 42],
            [36, 73, 51, 59, 44],
            [37, 76, 53, 61, 46],
            [38, 78, 54, 63, 47],
            [39, 81, 56, 65, 49],
            [40, 83, 58, 67, 50],
            [42, 86, 59, 69, 52],
            [44, 90, 63, 73, 55],
            [45, 93, 64, 75, 56],
            [46, 95, 66, 77, 58],
            [48, 98, 68, 79, 59],
            [49, 100, 70, 81, 61],
            [50, 103, 71, 83, 62],
            [52, 106, 74, 86, 65],
            [53, 109, 76, 88, 66],
            [54, 111, 77, 90, 68],
            [56, 114, 79, 92, 69],
            [57, 116, 81, 94, 71],
            [59, 120, 83, 97, 73],
            [60, 124, 86, 100, 75],
            [62, 126, 88, 102, 77],
            [63, 129, 89, 104, 78],
            [64, 131, 91, 106, 80],
            [65, 134, 93, 108, 81],
            [66, 136, 94, 110, 83],
            [68, 140, 97, 113, 85],
            [69, 142, 99, 115, 86],
            [71, 145, 100, 117, 88],
            [72, 147, 102, 119, 89],
            [74, 151, 105, 122, 92],
            [75, 153, 106, 124, 93],
            [76, 156, 108, 126, 95],
            [77, 158, 110, 128, 96],
            [79, 162, 112, 131, 98],
            [84, 173, 120, 140, 105],
            [90, 184, 128, 149, 112],
            [95, 195, 135, 158, 119],
            [96, 198, 137, 160, 120],
            [98, 201, 140, 163, 122],
            [99, 204, 141, 165, 124],
            [101, 206, 143, 167, 125],
            [102, 209, 145, 169, 127],
            [103, 211, 146, 171, 128],
            [108, 222, 154, 180, 135],
            [111, 228, 158, 185, 139],
            [117, 240, 166, 194, 146],
            [122, 251, 174, 203, 152],
            [124, 253, 175, 205, 154],
            [124, 256, 177, 207, 155],
            [126, 258, 179, 209, 157],
            [127, 262, 181, 212, 159],
            [129, 264, 183, 214, 161],
            [130, 268, 186, 217, 163],
            [133, 273, 189, 221, 166],
            [139, 284, 197, 230, 173],
            [144, 295, 204, 239, 179],
            [147, 301, 209, 244, 183],
            [148, 304, 210, 246, 185],
            [149, 306, 212, 248, 186],
            [154, 317, 220, 257, 193],
            [160, 328, 227, 266, 200],
            [165, 339, 235, 275, 206],
            [171, 350, 243, 284, 213],
            [176, 361, 250, 293, 220],
            [241, 495, 343, 401, 301],
            [285, 585, 405, 474, 356],
            [333, 684, 474, 555, 416],
            [391, 801, 555, 650, 488],
            [459, 941, 652, 763, 572],
            [540, 1107, 767, 898, 674],
            [561, 1151, 797, 934, 701],
            [583, 1196, 828, 970, 728],
            [605, 1240, 859, 1006, 755],
            [626, 1284, 890, 1042, 782],
        ]
    ];
    var race_base_stats = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [3, -3, 1, -3, 2],
        [5, -4, 1, -1, -1],
        [-4, 4, 0, 0, 0],
        [-1, -2, 0, -2, 5],
        [5, -4, 1, -4, 2],
        [-5, 2, 0, 3, 0],
        [1, 2, 0, -4, 1],
        [-3, 2, 0, 3, -2],
        [-3, 2, 0, 3, -2],
        [1, -3, 0, 0, 2],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [3, 2, 0, -4, -1],
        [0, 0, 0, 0, 0],
        [0, -2, 1, -1, 2],
        [0, -2, 1, -1, 2],
        [0, -2, 1, -1, 2]
    ];
})(data || (data = {}));
var EventManager = (function () {
    function EventManager() {
        this.GAME_LOOP_UPDATE = new Phaser.Signal();
        this.TARGET_CHANGE_EVENT = new Phaser.Signal();
        this.UNIT_HEALTH_CHANGE = new Phaser.Signal();
        this.UNIT_ABSORB = new Phaser.Signal();
        this.UNIT_STARTS_SPELLCAST = new Phaser.Signal();
        this.UNIT_FINISH_SPELLCAST = new Phaser.Signal();
        this.UNIT_CANCEL_SPELLCAST = new Phaser.Signal();
        this.UI_ERROR_MESSAGE = new Phaser.Signal();
        this.UNIT_DEATH = new Phaser.Signal();
        this.GAME_LOOP_RENDER = new Phaser.Signal();
        this.ON_COOLDOWN_START = new Phaser.Signal();
        this.ON_COOLDOWN_ENDED = new Phaser.Signal();
    }
    return EventManager;
})();
var game;
var heightFactor = window.innerHeight / 100;
var widthFactor = window.innerWidth / 100;
window.onload = function () {
    // Create an instance of the Phaser game engine. 
    // Force WEBGL since Canvas doesnt support textures / blendmodes which we use heavily.
    // Automatically starts the boot state aka. application entry point
    game = new Game('100%', '100%', Phaser.WEBGL, undefined, States.Boot);
};
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig) {
        _super.call(this, width, height, renderer, parent, state, transparent, antialias, physicsConfig);
        this.gameVersion = 0;
        this.defaultFont = "myriad";
        this.addons = new AddonManager();
    }
    Game.prototype.sendKeyBoardInputToCurrentState = function (keyPressData) {
        var currentState = this.state.getCurrentState();
        if (!currentState.handleKeyBoardInput)
            return;
        else
            currentState.handleKeyBoardInput(keyPressData);
    };
    ;
    return Game;
})(Phaser.Game);
/* Reads WoW combatlog and puts the data into a javascript-object for easy access. */
/* Not really used by the game atm, but could be cool thing to expand upon later */
var cl_parser;
(function (cl_parser) {
    function parse(rawCombatLog) {
        if (!rawCombatLog || typeof rawCombatLog != 'string') {
            return;
        }
        var combatlog = rawCombatLog.split('\n'), logStartTime = _HHMMSStoMS(combatlog[0].slice(6, 17)), currentLine, evt_data, event_obj, parsedCombatLog = [], line;
        for (line in combatlog) {
            currentLine = combatlog[line];
            evt_data = currentLine.slice(20).split(',');
            event_obj = {
                id: line,
                timestamp: _HHMMSStoMS(currentLine.slice(6, 17)) - logStartTime,
                type: evt_data[0],
                source_id: evt_data[1],
                source_name: evt_data[2],
                dest_id: evt_data[5],
                dest_name: evt_data[6],
                spell_school: _schoolNameFromId(+evt_data[8]),
                amount: +evt_data[21] || 0,
                data: evt_data
            };
            parsedCombatLog.push(event_obj);
        }
        console.log("Parsing complete without error! ( " + combatlog.length + " lines total )");
        return parsedCombatLog;
    }
    cl_parser.parse = parse;
    function _HHMMSStoMS(HHMMSS) {
        var arr = HHMMSS.split(':');
        return arr[0] * 60000 * 60000 + arr[1] * 60000 + arr[2] * 1000;
    }
    function filter() {
    }
    function validate() {
    }
    function _schoolNameFromId(schoolId) {
        switch (schoolId) {
            case 0x0: return 'Physical';
            case 0x1: return 'Physical';
            case 0x2: return 'Holy';
            case 0x3: return 'Holystrike';
            case 0x4: return 'Holy';
            case 0x5: return 'Flamestrike';
            case 0x6: return 'Holyfire';
            case 0x8: return 'Nature';
            case 0x9: return 'Stormstrike';
            case 0xA: return 'Holystorm';
            case 0xB: return 'Firestorm';
            case 0xC: return 'Firestorm';
            case 0x11: return 'Froststrike';
        }
    }
})(cl_parser || (cl_parser = {}));
var Raid = (function () {
    function Raid(eventManager) {
        this.players = [];
        this.events = eventManager;
    }
    Raid.prototype.getPlayerList = function () {
        return this.players;
    };
    Raid.prototype.generateTestPlayers = function () {
        var playersToBeCreated = 20;
        while (--playersToBeCreated) {
            var classs = game.rnd.between(player_class.MIN, player_class.MAX), race = game.rnd.between(player_race.MIN, player_race.MAX), level = 100, name = data.generatePlayerName();
            var unit = this.createUnit(classs, race, level, name);
            this.addPlayer(unit);
        }
    };
    Raid.prototype.addPlayer = function (unit) {
        this.players.push(unit);
    };
    Raid.prototype.createUnit = function (classs, race, level, name) {
        if (level < player_level.MIN || level > player_level.MAX)
            level = player_level.DEFAULT;
        else
            level = level;
        switch (classs) {
            case class_e.PRIEST:
                return new Priest.Priest(race, level, name, this.events);
                break;
            default:
                return new Player(classs, race, level, name, this.events);
                break;
        }
    };
    Raid.prototype.startTestDamage = function () {
        var tank = this.players[2];
        var createSomeRandomDamage = setInterval(randomDamage.bind(this), 3600);
        var createSomeRandomDamage2 = setInterval(randomDamage2.bind(this), 1560);
        var createSomeRandomDamage3 = setInterval(applyAbsorb.bind(this), 1960);
        var testAoeDamage = setInterval(aoeDamage.bind(this), 1960);
        var testAoeHealing = setInterval(aoeHealing.bind(this), 2500);
        function randomDamage2() {
            var random = game.rnd.between(0, this.players.length);
            this.players[random].recive_damage({ amount: game.rnd.between(100000, 250000) });
        }
        function randomDamage() {
            tank.recive_damage({ amount: game.rnd.between(15555, 338900) });
        }
        function aoeDamage() {
            var i = game.rnd.between(0, this.players.length);
            for (; i < this.players.length; i++) {
                var player = this.players[i];
                player.recive_damage({ amount: game.rnd.between(25555, 68900) });
            }
        }
        function aoeHealing() {
            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                player.setHealth(player.getCurrentHealth() + game.rnd.between(15000, 78900));
            }
        }
        function applyAbsorb() {
            tank.setHealth(tank.getCurrentHealth() + game.rnd.between(10000, 38900));
        }
    };
    return Raid;
})();
var States;
(function (States) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            game.load.image("MenuScreenText", "./assets/menu_state_text.png");
            game.load.image("MenuScreenBackground", "./assets/textures/bg_texture.png");
            game.load.image("castbar_texture", "./assets/textures/BantoBar.png");
            game.load.image("castbar_texture2", "./assets/textures/LiteStep.png");
            game.load.image("ab_texture", "./assets/textures/action_bar_texture.png");
            game.load.image("bg", "./assets/play_state_background.png");
            game.load.image("icon_5", "./assets/icons/spell_holy_powerwordshield.jpg");
            game.load.image("icon_2", "./assets/icons/power_infusion.jpg");
            game.load.bitmapFont("myriad", "./assets/fonts/font.png", "./assets/fonts/font.xml");
        };
        Boot.prototype.onWindowResize = function (data) {
            console.log("NEW WIDTH: " + data.width, "NEW HEIGHT: " + data.height);
            game.canvas.height = window.innerHeight;
            game.canvas.width = window.innerWidth;
            heightFactor = window.innerHeight / 100;
            widthFactor = window.innerWidth / 100;
        };
        Boot.prototype.create = function () {
            var _this = this;
            game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            game.scale.onSizeChange.add(function (data) { return _this.onWindowResize(data); });
            game.state.add("MainMenu", States.MainMenu);
            game.state.add("Play", States.Play);
            game.addons.add("Cast Bar 0.1", Addons.CastFrame);
            game.addons.add("Raid Frames 0.1", Addons.RaidFrame);
            game.addons.add("Unit Frames 0.1", Addons.UnitFrames);
            game.addons.add("Debug", Addons.Debug);
            game.time.advancedTiming = true;
            game.tweens.frameBased = true;
            game.input.keyboard.addCallbacks(game, undefined, undefined, game.sendKeyBoardInputToCurrentState);
            game.state.start("MainMenu");
        };
        return Boot;
    })(Phaser.State);
    States.Boot = Boot;
    ;
})(States || (States = {}));
var States;
(function (States) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.add.image(0, 0, "MenuScreenBackground");
            this.add.image(0, 0, "MenuScreenText").blendMode = PIXI.blendModes.ADD;
            this.printAddonList();
        };
        MainMenu.prototype.printAddonList = function () {
            var addonList = game.addons.getListOfAddons();
            var lineHeight = 15;
            var headerText = this.add.bitmapText(0, 0, game.defaultFont, "### REGISTRED ADDONS ###", 14);
            headerText.tint = 0xFF00FF;
            for (var i = 0; i < addonList.length; i++) {
                this.add.bitmapText(0, lineHeight * i + lineHeight, game.defaultFont, "## Addon Name: " + addonList[i][0] + "  ## Enabled : " + addonList[i][1], 14);
            }
            ;
        };
        MainMenu.prototype.handleKeyBoardInput = function (keyCode) {
            game.state.start("Play");
        };
        return MainMenu;
    })(Phaser.State);
    States.MainMenu = MainMenu;
})(States || (States = {}));
var States;
(function (States) {
    var Play = (function (_super) {
        __extends(Play, _super);
        function Play() {
            _super.apply(this, arguments);
            this.events = new EventManager();
            this.raid = new Raid(this.events);
        }
        Play.prototype.create = function () {
            this.world.alpha = 0;
            this.add.tween(this.world).to({ alpha: 1 }, 4000, Phaser.Easing.Cubic.InOut, true);
            game.add.image(game.stage.x, game.stage.y, "bg");
            this.player = this.raid.createUnit(class_e.PRIEST, race_e.RACE_BLOOD_ELF, 100, "Player");
            this.raid.addPlayer(this.player);
            this.raid.generateTestPlayers();
            game.addons.loadEnabledAddons(this);
            this.raid.startTestDamage();
            var test = new CooldownFrame(this, 5, 500, 500);
            var test2 = new CooldownFrame(this, 2, 555, 500);
        };
        Play.prototype.update = function () {
            this.events.GAME_LOOP_UPDATE.dispatch();
        };
        ;
        Play.prototype.handleKeyBoardInput = function (key) {
            // ## TODO ## : Find a better way to deal with this, maybe just send the input to the addons, and let the addons/ui decide what to do with it.
            var keybindings = data.getKeyBindings();
            for (var binding in keybindings) {
                var keybinding = keybindings[binding];
                if (keybinding.key == key) {
                    if (keybinding.spell)
                        this.player.cast_spell(keybinding.spell);
                    break;
                }
            }
        };
        Play.prototype.render = function () {
            this.events.GAME_LOOP_RENDER.dispatch();
        };
        return Play;
    })(Phaser.State);
    States.Play = Play;
})(States || (States = {}));
// ### Major todo: Clean up & refactoring ###
/*----  Unit frame to contain basic unit info. -------------- */
/*      In it most basic form it will only display a healthbar.  */
/*      This should be the first thing to be implemented (Used for target/ player frame + raid frames )  */
var UnitFrame = (function () {
    function UnitFrame(parentContainer, x, y, w, h, unit, playState) {
        var _this = this;
        this.config = {
            allowedAbsorbOverflow: 10
        };
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.unit = unit;
        this.state = playState;
        this.container = new Phaser.Graphics(game, x, y);
        this.container.width = w;
        this.container.height = h;
        this.health = new Phaser.Graphics(game, 0, 0);
        this.absorb = new Phaser.Graphics(game, 0, 0);
        this.absorb.blendMode = PIXI.blendModes.ADD;
        this.absorb.alpha = 0.5;
        this.overlay_texture = new Phaser.Sprite(game, 0, 0, "castbar_texture");
        this.overlay_texture.blendMode = PIXI.blendModes.MULTIPLY;
        this.overlay_texture.width = w;
        this.overlay_texture.height = h;
        this.unit_name = this.state.add.bitmapText(w / 2, h / 2, "myriad", this.unit.name, 12);
        this.unit_name.tint = data.getClassColor(this.unit.classId);
        this.unit_name.anchor.set(0.5);
        this.container.addChild(this.health);
        this.container.addChild(this.overlay_texture);
        this.container.addChild(this.absorb);
        this.container.addChild(this.unit_name);
        parentContainer.add(this.container);
        this.container.inputEnabled = true;
        this.container.events.onInputDown.add(function () {
            _this.state.player.setTarget(_this.unit);
        });
        this.initHealthBar();
        this.initAbsorbBar();
        this.UPDATE();
        this.state.events.UNIT_HEALTH_CHANGE.add(function () { return _this.UPDATE(); });
        this.state.events.UNIT_ABSORB.add(function () { return _this.UPDATE(); });
        this.state.events.UNIT_DEATH.add(function (evt) { return _this.UNIT_DEATH(evt); });
    }
    UnitFrame.prototype.UPDATE = function () {
        var new_health_width = this.calcBarWidth(this.unit.getCurrentHealth(), this.unit.getMaxHealth());
        var new_absorb_width = this.calcBarWidth(this.unit.getAbsorb(), this.unit.getMaxHealth());
        var new_absorb_x = new_health_width;
        if ((new_absorb_width + new_health_width) > this.width)
            new_absorb_width = this.width - new_health_width + this.config.allowedAbsorbOverflow;
        if (new_health_width <= 0)
            new_health_width = 1;
        if (new_absorb_width <= 0)
            new_absorb_width = 1;
        this.state.add.tween(this.health).to({ width: new_health_width }, 150, "Linear", true);
        this.state.add.tween(this.absorb).to({ x: new_absorb_x }, 150, "Linear", true);
        this.state.add.tween(this.absorb).to({ width: new_absorb_width }, 50, "Linear", true);
    };
    UnitFrame.prototype.UNIT_MANA_CHANGE = function (eventData) {
    };
    UnitFrame.prototype.UNIT_DEATH = function (evt) {
        if (evt.unit != this.unit)
            return;
        this.health.width = this.width;
        this.unit_name.setText("DEAD");
        this.health.alpha = 0;
        this.absorb.alpha = 0;
    };
    UnitFrame.prototype.calcBarWidth = function (currentValue, maxValue) {
        var barWidthInPixels = Math.round((currentValue / maxValue) * this.width);
        return barWidthInPixels;
    };
    UnitFrame.prototype.initUnitName = function () {
        this.unit_name.setText(this.unit.name);
        this.unit_name.tint = data.getClassColor(this.unit.classId);
    };
    UnitFrame.prototype.initHealthBar = function () {
        this.health.clear();
        this.health.beginFill(data.getClassColor(this.unit.classId));
        this.health.drawRect(0, 0, 1, this.height);
    };
    UnitFrame.prototype.initAbsorbBar = function () {
        this.absorb.clear();
        this.absorb.beginFill(0x43b6e8);
        this.absorb.drawRect(0, 0, 1, this.height);
    };
    return UnitFrame;
})();
var CooldownFrame = (function () {
    function CooldownFrame(state, spellid, x, y) {
        var _this = this;
        this.x = 500;
        this.y = 500;
        this.w = 50;
        this.h = 50;
        this.angle = { current: 0 };
        this.playState = state;
        this.spellid = spellid;
        this.container = this.playState.add.group();
        this.container.x = x;
        this.container.y = y;
        var spellIcon = this.playState.add.image(0, 0, "icon_" + spellid);
        spellIcon.width = this.w;
        spellIcon.height = this.h;
        spellIcon.alpha = 1;
        var mask = this.playState.add.graphics(this.container.x, this.container.y);
        mask.beginFill(0xFFFFFF);
        mask.drawRect(0, 0, this.w, this.h);
        this.cd_overlay = this.playState.add.graphics(0, 0);
        this.cd_overlay.alpha = 0.8;
        this.cd_overlay.mask = mask;
        this.cd_overlay.blendMode = PIXI.blendModes.MULTIPLY;
        this.container.add(spellIcon);
        this.container.add(this.cd_overlay);
        this.playState.events.ON_COOLDOWN_START.add(function (e) { return _this._onCooldownStart(e); });
        this.playState.events.ON_COOLDOWN_ENDED.add(function (e) { return _this._onCooldownEnded(e); });
    }
    CooldownFrame.prototype._onCooldownStart = function (event) {
        var _this = this;
        if (event.spellid != this.spellid)
            return;
        this.cd_overlay.alpha = 0.8;
        this.animTween = this.playState.add.tween(this.angle).to({ current: 270 }, event.cooldownLenght, undefined, true);
        this.playState.events.GAME_LOOP_UPDATE.add(function () { return _this._updateCooldownArc(); });
    };
    CooldownFrame.prototype._onCooldownEnded = function (event) {
        if (event.spellid != this.spellid)
            return;
        this.cd_overlay.alpha = 0;
        this.animTween.stop();
        this.angle.current = 0;
        this.cd_overlay.clear();
    };
    CooldownFrame.prototype._updateCooldownArc = function () {
        this.cd_overlay.clear();
        this.cd_overlay.beginFill(0x323232);
        this.cd_overlay.arc(25, 25, 50, Phaser.Math.degToRad(270), Phaser.Math.degToRad(this.angle.current), true);
        this.cd_overlay.endFill();
    };
    return CooldownFrame;
})();
var TargetFrame = (function (_super) {
    __extends(TargetFrame, _super);
    function TargetFrame(parentContainer, x, y, w, h, unit, state) {
        var _this = this;
        _super.call(this, parentContainer, x, y, w, h, unit, state);
        this.ownerUnit = this.unit;
        this.unit = this.ownerUnit.target;
        this.state.events.TARGET_CHANGE_EVENT.add(function () { return _this.UNIT_TARGET_CHANGE(); });
    }
    TargetFrame.prototype.UNIT_TARGET_CHANGE = function () {
        this.unit = this.ownerUnit.target;
        this.initUnitName();
        this.initHealthBar();
        this.initAbsorbBar();
        this.UPDATE();
    };
    return TargetFrame;
})(UnitFrame);
//# sourceMappingURL=game.js.map