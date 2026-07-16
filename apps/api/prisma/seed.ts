/* eslint-disable no-console */
import { CalendarEventType, Gender, PrismaClient, QuestionType, QuestionnaireStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect();
    console.log('🌱 Début du seeding...');

    // Nettoyer la base de données d'abord (ordre important pour les FK)
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.questionnaire.deleteMany();
    await prisma.matchPlayerNote.deleteMany();
    await prisma.calendarEvent.deleteMany();
    await prisma.questionTemplate.deleteMany();
    await prisma.questionnaireTemplate.deleteMany();
    await prisma.metric.deleteMany();
    await prisma.player.deleteMany();
    await prisma.oAuthAccount.deleteMany();
    await prisma.user.deleteMany();
    await prisma.team.deleteMany();
    await prisma.club.deleteMany();
    await prisma.position.deleteMany();
    await prisma.sport.deleteMany();

    // Créer des sports
    const lol = await prisma.sport.create({
        data: {
            name: 'League of Legends',
        },
    });

    const rocket = await prisma.sport.create({
        data: {
            name: 'Rocket League',
        },
    });
    const cs = await prisma.sport.create({
        data: {
            name: 'Counter Strike',
        },
    });
    const valorant = await prisma.sport.create({
        data: {
            name: 'Valorant',
        },
    });

    console.log('✅ Sports créés');

    // Créer des positions pour LOL
    const lolPositions = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
    for (const positionName of lolPositions) {
        await prisma.position.create({
            data: {
                name: positionName,
                sportId: lol.id,
            },
        });
    }

    // Créer des positions pour Rocket League
    const rlPlayerPosition = await prisma.position.create({
        data: {
            name: 'Player',
            sportId: rocket.id,
        },
    });

    // Créer des positions pour Valorant
    const valorantPositions = ['Duelist', 'Controller', 'Initiator', 'Sentinel'];
    for (const positionName of valorantPositions) {
        await prisma.position.create({
            data: {
                name: positionName,
                sportId: valorant.id,
            },
        });
    }

    // Créer des positions pour CS2 (Counter-Strike)
    const csPositions = ['Entry Fragger', 'AWPer', 'Lurker', 'Support', 'IGL'];
    for (const positionName of csPositions) {
        await prisma.position.create({
            data: {
                name: positionName,
                sportId: cs.id,
            },
        });
    }

    console.log('✅ Positions créées');

    // Créer des clubs
    const kc = await prisma.club.create({
        data: {
            name: 'Karmine Corp',
            logoUrl: 'kc.png',
            description: 'Club esports français',
        },
    });

    const vitality = await prisma.club.create({
        data: {
            name: 'Team Vitality',
            logoUrl: 'vitality.png',
            description: 'Club esports français',
        },
    });

    console.log('✅ Clubs créés');

    // Créer des utilisateurs staff
    const staff1User = await prisma.user.create({
        data: {
            email: 'coach.kc@playertracker.fr',
            password: await bcrypt.hash('coach123', 10),
            role: Role.STAFF,
            isEmailVerified: true,
        },
    });
    const staff1 = await prisma.staff.create({
        data: {
            userId: staff1User.id,
            clubId: kc.id,
            firstName: 'Kamel',
            lastName: 'Kebir',
        },
    });

    const staff2User = await prisma.user.create({
        data: {
            email: 'coach.vitality@playertracker.fr',
            password: await bcrypt.hash('coach123', 10),
            role: Role.STAFF,
            isEmailVerified: true,
        },
    });
    await prisma.staff.create({
        data: {
            userId: staff2User.id,
            clubId: vitality.id,
            firstName: 'Fabien',
            lastName: 'Devide',
        },
    });

    console.log('✅ Utilisateurs staff créés');

    // Créer des équipes
    const kclec = await prisma.team.create({
        data: {
            name: 'Karmine Corp LEC',
            description: 'Équipe LEC de Karmine Corp',
            sportId: lol.id,
            logoUrl: 'kc.png',
            clubId: kc.id,
        },
    });
    const kcb = await prisma.team.create({
        data: {
            name: 'Karmine Corp Blue',
            description: 'Équipe LFL de Karmine Corp',
            sportId: lol.id,
            logoUrl: 'kcb.png',
            clubId: kc.id,
        },
    });
    const kcrl = await prisma.team.create({
        data: {
            name: 'Karmine Corp RL',
            description: 'Équipe Rocket League de Karmine Corp',
            sportId: rocket.id,
            logoUrl: 'kc.png',
            clubId: kc.id,
        },
    });
    const kcValo = await prisma.team.create({
        data: {
            name: 'Karmine Corp VALO',
            description: 'Équipe Valorant de Karmine Corp',
            sportId: valorant.id,
            logoUrl: 'kc.png',
            clubId: kc.id,
        },
    });

    const vitalityRl = await prisma.team.create({
        data: {
            name: 'Team Vitality RL',
            description: 'Équipe Rocket League de Team Vitality',
            sportId: rocket.id,
            logoUrl: 'vitality.png',
            clubId: vitality.id,
        },
    });
    const vitalityLol = await prisma.team.create({
        data: {
            name: 'Team Vitality LEC',
            description: 'Équipe LEC de Team Vitality',
            sportId: lol.id,
            logoUrl: 'vitality.png',
            clubId: vitality.id,
        },
    });
    const vitalityBee = await prisma.team.create({
        data: {
            name: 'Team Vitality BEE',
            description: 'Équipe BEE de Team Vitality',
            sportId: lol.id,
            logoUrl: 'vitality.png',
            clubId: vitality.id,
        },
    });
    const vitalityCS = await prisma.team.create({
        data: {
            name: 'Team Vitality CS',
            description: 'Équipe Counter Strike de Team Vitality',
            sportId: cs.id,
            logoUrl: 'vitality.png',
            clubId: vitality.id,
        },
    });
    const vitalityValo = await prisma.team.create({
        data: {
            name: 'Team Vitality VALO',
            description: 'Équipe Valorant de Team Vitality',
            sportId: valorant.id,
            logoUrl: 'vitality.png',
            clubId: vitality.id,
        },
    });

    // Récupérer les positions
    const midPosition = await prisma.position.findFirst({
        where: { name: 'Mid', sportId: lol.id },
    });
    const adcPosition = await prisma.position.findFirst({
        where: { name: 'ADC', sportId: lol.id },
    });
    const topPosition = await prisma.position.findFirst({
        where: { name: 'Top', sportId: lol.id },
    });
    const junglePosition = await prisma.position.findFirst({
        where: { name: 'Jungle', sportId: lol.id },
    });
    const supportPosition = await prisma.position.findFirst({
        where: { name: 'Support', sportId: lol.id },
    });
    const iglPositionValo = await prisma.position.findFirst({
        where: { name: 'Initiator', sportId: valorant.id },
    });
    const sentinelPosition = await prisma.position.findFirst({
        where: { name: 'Sentinel', sportId: valorant.id },
    });
    const duelistPosition = await prisma.position.findFirst({
        where: { name: 'Duelist', sportId: valorant.id },
    });
    const controllerPosition = await prisma.position.findFirst({
        where: { name: 'Controller', sportId: valorant.id },
    });
    const initiatorPosition = await prisma.position.findFirst({
        where: { name: 'Initiator', sportId: valorant.id },
    });
    const awpPosition = await prisma.position.findFirst({
        where: { name: 'AWPer', sportId: cs.id },
    });
    const iglPositionCS = await prisma.position.findFirst({
        where: { name: 'IGL', sportId: cs.id },
    });
    const entryPosition = await prisma.position.findFirst({
        where: { name: 'Entry Fragger', sportId: cs.id },
    });
    const supportPositionCS = await prisma.position.findFirst({
        where: { name: 'Support', sportId: cs.id },
    });
    const lurkerPosition = await prisma.position.findFirst({
        where: { name: 'Lurker', sportId: cs.id },
    });

    if (!midPosition || !adcPosition || !topPosition || !junglePosition || !supportPosition || !rlPlayerPosition) {
        throw new Error('Positions LOL manquantes');
    }
    if (!iglPositionValo || !sentinelPosition || !duelistPosition || !controllerPosition || !initiatorPosition) {
        throw new Error('Positions Valorant manquantes');
    }
    if (!awpPosition || !iglPositionCS || !entryPosition || !supportPositionCS || !lurkerPosition) {
        throw new Error('Positions CS manquantes');
    }

    const playersData = [
        // ==========================================
        // KARMINE CORP (KC) - Saison 2026
        // ==========================================

        // --- LOL LEC (Karmine Corp) ---
        {
            firstName: 'Chang-dong',
            lastName: 'Kim',
            nickName: 'Canna',
            email: 'canna@playertracker.fr',
            clubId: kc.id,
            teamId: kclec.id,
            positionId: topPosition.id,
            birthDate: new Date('2000-02-11'),
            gender: Gender.MALE,
            nationality: 'KR',
        },
        {
            firstName: 'Martin',
            lastName: 'Sundelin',
            nickName: 'Yike',
            email: 'yike@playertracker.fr',
            clubId: kc.id,
            teamId: kclec.id,
            positionId: junglePosition.id,
            birthDate: new Date('2000-11-10'),
            gender: Gender.MALE,
            nationality: 'SE',
        },
        {
            firstName: 'Yea-hoo',
            lastName: 'Kang',
            nickName: 'Kyeahoo',
            email: 'kyeahoo@playertracker.fr',
            clubId: kc.id,
            teamId: kclec.id,
            positionId: midPosition.id,
            birthDate: new Date('2005-09-21'),
            gender: Gender.MALE,
            nationality: 'KR',
        },
        {
            firstName: 'Caliste',
            lastName: 'Henry-Hennebert',
            nickName: 'Caliste',
            email: 'caliste@playertracker.fr',
            clubId: kc.id,
            teamId: kclec.id,
            positionId: adcPosition.id,
            birthDate: new Date('2006-08-28'),
            gender: Gender.MALE,
            nationality: 'FR',
        },
        {
            firstName: 'Alan',
            lastName: 'Cwalina',
            nickName: 'Busio',
            email: 'busio@playertracker.fr',
            clubId: kc.id,
            teamId: kclec.id,
            positionId: supportPosition.id,
            birthDate: new Date('2003-05-13'),
            gender: Gender.MALE,
            nationality: 'PL',
        },

        // --- LOL LFL (KC Blue) ---
        {
            firstName: 'Alessandro',
            lastName: 'Xu Hongtao',
            nickName: 'Tao',
            email: 'tao@playertracker.fr',
            clubId: kc.id,
            teamId: kcb.id,
            positionId: topPosition.id,
            birthDate: new Date('2004-05-15'),
            gender: Gender.MALE,
            nationality: 'IT',
        },
        {
            firstName: 'Johnny',
            lastName: 'Dang',
            nickName: 'Yukino',
            email: 'yukino@playertracker.fr',
            clubId: kc.id,
            teamId: kcb.id,
            positionId: junglePosition.id,
            birthDate: new Date('2004-10-20'),
            gender: Gender.MALE,
            nationality: 'VN',
        },
        {
            firstName: 'Kamil',
            lastName: 'Haudegond',
            nickName: 'Kamiloo',
            email: 'kamiloo@playertracker.fr',
            clubId: kc.id,
            teamId: kcb.id,
            positionId: midPosition.id,
            birthDate: new Date('2006-01-10'),
            gender: Gender.MALE,
            nationality: 'FR',
        },
        {
            firstName: 'Costin',
            lastName: 'Pestrițu',
            nickName: 'Hazel',
            email: 'hazel@playertracker.fr',
            clubId: kc.id,
            teamId: kcb.id,
            positionId: adcPosition.id,
            birthDate: new Date('2003-03-25'),
            gender: Gender.MALE,
            nationality: 'RO',
        },
        {
            firstName: 'Olivier',
            lastName: 'Payet',
            nickName: 'Prime',
            email: 'prime@playertracker.fr',
            clubId: kc.id,
            teamId: kcb.id,
            positionId: supportPosition.id,
            birthDate: new Date('2000-09-02'),
            gender: Gender.MALE,
            nationality: 'FR',
        },

        // --- VALORANT (KC) ---
        {
            firstName: 'Hazem',
            lastName: 'Khaled',
            nickName: 'Avez',
            email: 'avez@playertracker.fr',
            clubId: kc.id,
            teamId: kcValo.id,
            positionId: iglPositionValo.id,
            birthDate: new Date('2003-01-01'),
            gender: Gender.MALE,
            nationality: 'EG',
        },
        {
            firstName: 'Dmitry',
            lastName: 'Ilyushin',
            nickName: 'SUYGETSU',
            email: 'suygetsu@playertracker.fr',
            clubId: kc.id,
            teamId: kcValo.id,
            positionId: sentinelPosition.id,
            birthDate: new Date('2002-07-18'),
            gender: Gender.MALE,
            nationality: 'RU',
        },
        {
            firstName: 'Bogdan',
            lastName: 'Naumov',
            nickName: 'sheydos',
            email: 'sheydos@playertracker.fr',
            clubId: kc.id,
            teamId: kcValo.id,
            positionId: initiatorPosition.id,
            birthDate: new Date('2001-06-21'),
            gender: Gender.MALE,
            nationality: 'RU',
        },
        {
            firstName: 'Burak',
            lastName: 'Alkan',
            nickName: 'LewN',
            email: 'lewn@playertracker.fr',
            clubId: kc.id,
            teamId: kcValo.id,
            positionId: duelistPosition.id,
            birthDate: new Date('2004-03-12'),
            gender: Gender.MALE,
            nationality: 'TR',
        },
        {
            firstName: 'Dastan',
            lastName: 'Zhumagali',
            nickName: 'dos9',
            email: 'dos9@playertracker.fr',
            clubId: kc.id,
            teamId: kcValo.id,
            positionId: controllerPosition.id,
            birthDate: new Date('2005-01-01'),
            gender: Gender.MALE,
            nationality: 'KZ',
        },

        // --- ROCKET LEAGUE (KC) ---
        {
            firstName: 'Axel',
            lastName: 'Touret',
            nickName: 'Vatira',
            email: 'vatira@playertracker.fr',
            clubId: kc.id,
            teamId: kcrl.id,
            positionId: rlPlayerPosition.id,
            birthDate: new Date('2006-05-11'),
            gender: Gender.MALE,
            nationality: 'FR',
        },
        {
            firstName: 'Tristan',
            lastName: 'Soyez',
            nickName: 'Atow',
            email: 'atow@playertracker.fr',
            clubId: kc.id,
            teamId: kcrl.id,
            positionId: rlPlayerPosition.id,
            birthDate: new Date('2007-02-28'),
            gender: Gender.MALE,
            nationality: 'FR',
        },
        {
            firstName: 'Charles',
            lastName: 'Sabiani',
            nickName: 'Juicy',
            email: 'juicy@playertracker.fr',
            clubId: kc.id,
            teamId: kcrl.id,
            positionId: rlPlayerPosition.id,
            birthDate: new Date('2005-05-05'),
            gender: Gender.MALE,
            nationality: 'FR',
        },

        // ==========================================
        // TEAM VITALITY - Saison 2026
        // ==========================================

        // --- LOL LEC (Vitality) ---
        {
            firstName: 'Kaan',
            lastName: 'Okan',
            nickName: 'Naak Nako',
            email: 'naaknako@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityLol.id,
            positionId: topPosition.id,
            birthDate: new Date('2004-08-15'),
            gender: Gender.MALE,
            nationality: 'TR',
        },
        {
            firstName: 'Linas',
            lastName: 'Nauncikas',
            nickName: 'Lyncas',
            email: 'lyncas@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityLol.id,
            positionId: junglePosition.id,
            birthDate: new Date('2004-01-20'),
            gender: Gender.MALE,
            nationality: 'LT',
        },
        {
            firstName: 'Marek',
            lastName: 'Brázda',
            nickName: 'Humanoid',
            email: 'humanoid@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityLol.id,
            positionId: midPosition.id,
            birthDate: new Date('2000-03-14'),
            gender: Gender.MALE,
            nationality: 'CZ',
        },
        {
            firstName: 'Matyáš',
            lastName: 'Orság',
            nickName: 'Carzzy',
            email: 'carzzy@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityLol.id,
            positionId: adcPosition.id,
            birthDate: new Date('2002-02-01'),
            gender: Gender.MALE,
            nationality: 'CZ',
        },
        {
            firstName: 'Kadir',
            lastName: 'Kemiksiz',
            nickName: 'Fleshy',
            email: 'fleshy@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityLol.id,
            positionId: supportPosition.id,
            birthDate: new Date('2003-04-10'),
            gender: Gender.MALE,
            nationality: 'TR',
        },

        // --- LOL LFL (Vitality.Bee) - Saison 2026 ---
        {
            firstName: 'Mehdi Ahmed',
            lastName: 'Bouchaffra',
            nickName: 'Potent',
            email: 'potent@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityBee.id,
            positionId: topPosition.id,
            birthDate: new Date('2003-12-20'), // Date indicative (ou utilisez la vôtre)
            gender: Gender.MALE,
            nationality: 'FR',
        },
        {
            firstName: 'Dawid',
            lastName: 'Drzyzga',
            nickName: 'Dawciu',
            email: 'dawciu@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityBee.id,
            positionId: junglePosition.id,
            birthDate: new Date('2004-06-15'),
            gender: Gender.MALE,
            nationality: 'PL',
        },
        {
            firstName: 'Mateusz',
            lastName: 'Czajka',
            nickName: 'Czajek',
            email: 'czajek@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityBee.id,
            positionId: midPosition.id,
            birthDate: new Date('2003-11-20'),
            gender: Gender.MALE,
            nationality: 'PL',
        },
        {
            firstName: 'Villas Burkal',
            lastName: 'Stadager',
            nickName: 'Vizzpers',
            email: 'vizzpers@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityBee.id,
            positionId: adcPosition.id,
            birthDate: new Date('2004-01-10'),
            gender: Gender.MALE,
            nationality: 'DK',
        },
        {
            firstName: 'Waleed Mohammed',
            lastName: 'Ismail',
            nickName: 'DeKap',
            email: 'dekap@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityBee.id,
            positionId: supportPosition.id,
            birthDate: new Date('2001-08-14'),
            gender: Gender.MALE,
            nationality: 'EG',
        },

        // --- CS2 (Vitality) ---
        {
            firstName: 'Mathieu',
            lastName: 'Herbaut',
            nickName: 'ZywOo',
            email: 'zywoo@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityCS.id,
            positionId: awpPosition.id,
            birthDate: new Date('2000-11-09'),
            gender: Gender.MALE,
            nationality: 'FR',
        },
        {
            firstName: 'Dan',
            lastName: 'Madesclaire',
            nickName: 'apEX',
            email: 'apex@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityCS.id,
            positionId: iglPositionCS.id,
            birthDate: new Date('1993-02-22'),
            gender: Gender.MALE,
            nationality: 'FR',
        },
        {
            firstName: 'Shahar',
            lastName: 'Shushan',
            nickName: 'flameZ',
            email: 'flamez@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityCS.id,
            positionId: entryPosition.id,
            birthDate: new Date('2003-06-22'),
            gender: Gender.MALE,
            nationality: 'IL',
        },
        {
            firstName: 'William',
            lastName: 'Merriman',
            nickName: 'mezii',
            email: 'mezii@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityCS.id,
            positionId: supportPositionCS.id,
            birthDate: new Date('1998-09-28'),
            gender: Gender.MALE,
            nationality: 'GB',
        },
        {
            firstName: 'Robin',
            lastName: 'Kool',
            nickName: 'ropz',
            email: 'ropz@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityCS.id,
            positionId: lurkerPosition.id,
            birthDate: new Date('1999-12-22'),
            gender: Gender.MALE,
            nationality: 'EE',
        },

        // --- VALORANT (Vitality) ---
        {
            firstName: 'Nikita',
            lastName: 'Sirmitev',
            nickName: 'Derke',
            email: 'derke@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityValo.id,
            positionId: duelistPosition.id,
            birthDate: new Date('2003-02-06'),
            gender: Gender.MALE,
            nationality: 'RU',
        },
        {
            firstName: 'Timofey',
            lastName: 'Khromov',
            nickName: 'Chronicle',
            email: 'chronicle@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityValo.id,
            positionId: initiatorPosition.id,
            birthDate: new Date('2002-08-16'),
            gender: Gender.MALE,
            nationality: 'RU',
        },
        {
            firstName: 'Elias',
            lastName: 'Olkkonen',
            nickName: 'Jamppi',
            email: 'jamppi@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityValo.id,
            positionId: iglPositionValo.id,
            birthDate: new Date('2001-07-27'),
            gender: Gender.MALE,
            nationality: 'FI',
        },
        {
            firstName: 'Dawid',
            lastName: 'Święć',
            nickName: 'PROFEK',
            email: 'profek@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityValo.id,
            positionId: controllerPosition.id,
            birthDate: new Date('2004-01-01'),
            gender: Gender.MALE,
            nationality: 'PL',
        },
        {
            firstName: 'Ștefan',
            lastName: 'Mîțcu',
            nickName: 'Sayonara',
            email: 'sayonara@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityValo.id,
            positionId: duelistPosition.id,
            birthDate: new Date('2008-01-01'),
            gender: Gender.MALE,
            nationality: 'RO',
        },

        // --- ROCKET LEAGUE (Vitality) ---
        {
            firstName: 'Alexis',
            lastName: 'Bernier',
            nickName: 'Zen',
            email: 'zen@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityRl.id,
            positionId: rlPlayerPosition.id,
            birthDate: new Date('2007-02-20'),
            gender: Gender.MALE,
            nationality: 'FR',
        },
        {
            firstName: 'Yanis',
            lastName: 'Champenois',
            nickName: 'ExoTiik',
            email: 'exotiik@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityRl.id,
            positionId: rlPlayerPosition.id,
            birthDate: new Date('2003-03-12'),
            gender: Gender.MALE,
            nationality: 'FR',
        },
        {
            firstName: 'Stizzy',
            lastName: 'Stizzy',
            nickName: 'Stizzy',
            email: 'stizzy@playertracker.fr',
            clubId: vitality.id,
            teamId: vitalityRl.id,
            positionId: rlPlayerPosition.id,
            birthDate: new Date('2007-01-01'),
            gender: Gender.MALE,
            nationality: 'US',
        },
    ];

    // Boucle d'insertion finale
    for (const playerData of playersData) {
        if (!playerData.positionId) {
            throw new Error(`Position manquante pour ${playerData.firstName} ${playerData.lastName}`);
        }
        const user = await prisma.user.create({
            data: {
                email: playerData.email,
                password: await bcrypt.hash('player123', 10),
                role: Role.PLAYER,
                isEmailVerified: true,
            },
        });
        const player = await prisma.player.create({
            data: {
                userId: user.id,
                clubId: playerData.clubId,
                teamId: playerData.teamId,
                positionId: playerData.positionId,
                firstName: playerData.firstName,
                lastName: playerData.lastName,
                nickName: playerData.nickName,
                photoUrl: `${playerData.nickName?.toLowerCase().replace(/\s+/g, '') || playerData.firstName.toLowerCase().replace(/\s+/g, '')}.png`,
            },
        });
        await prisma.sensitivePlayerData.create({
            data: {
                playerId: player.id,
                birthDate: playerData.birthDate,
                gender: playerData.gender,
                nationality: playerData.nationality,
            },
        });
    }

    console.log('✅ Joueurs créés');

    const kcLecPlayers = await prisma.player.findMany({
        where: { teamId: kclec.id },
        orderBy: { id: 'asc' },
    });

    const eventDates = [
        {
            title: 'LEC scrim block vs G2 Esports',
            description: 'Entraînement officiel encadré, focus early game et communication.',
            type: CalendarEventType.TRAINING,
            startsAt: new Date('2026-04-27T14:00:00.000Z'),
            endsAt: new Date('2026-04-27T17:30:00.000Z'),
            opponent: 'G2 Esports',
            location: 'Berlin - Gaming House KC',
        },
        {
            title: 'LEC match day vs Team Vitality',
            description: 'Match officiel LEC, préparation et débrief inclus.',
            type: CalendarEventType.MATCH,
            startsAt: new Date('2026-04-29T18:00:00.000Z'),
            endsAt: new Date('2026-04-29T21:00:00.000Z'),
            opponent: 'Team Vitality',
            location: 'Riot Games Arena Berlin',
        },
        {
            title: 'LEC review + practice vs Fnatic',
            description: 'Review vidéo puis entraînement officiel orienté teamfights.',
            type: CalendarEventType.TRAINING,
            startsAt: new Date('2026-05-01T13:00:00.000Z'),
            endsAt: new Date('2026-05-01T17:00:00.000Z'),
            opponent: 'Fnatic',
            location: 'Berlin - Gaming House KC',
        },
        {
            title: 'LEC match day vs Fnatic',
            description: 'Match officiel LEC avec notes staff par joueur.',
            type: CalendarEventType.MATCH,
            startsAt: new Date('2026-05-02T17:00:00.000Z'),
            endsAt: new Date('2026-05-02T20:30:00.000Z'),
            opponent: 'Fnatic',
            location: 'Riot Games Arena Berlin',
        },
        {
            title: 'LEC scrim block vs G2 Esports',
            description: 'Entraînement officiel avec questionnaire de préparation.',
            type: CalendarEventType.TRAINING,
            startsAt: new Date('2026-05-22T13:00:00.000Z'),
            endsAt: new Date('2026-05-22T17:00:00.000Z'),
            opponent: 'G2 Esports',
            location: 'Berlin - Gaming House KC',
        },
        {
            title: 'LEC match day vs Movistar KOI',
            description: 'Match officiel à venir avec questionnaire post-match planifié.',
            type: CalendarEventType.MATCH,
            startsAt: new Date('2026-05-23T18:00:00.000Z'),
            endsAt: new Date('2026-05-23T21:00:00.000Z'),
            opponent: 'Movistar KOI',
            location: 'Riot Games Arena Berlin',
        },
    ];

    const calendarEvents = await Promise.all(
        eventDates.map((event) =>
            prisma.calendarEvent.create({
                data: {
                    ...event,
                    teamId: kclec.id,
                    isOfficial: true,
                },
            }),
        ),
    );

    const dailyQuestionnaire = await prisma.questionnaire.create({
        data: {
            title: 'KC LEC - Daily wellness check',
            description: 'Questionnaire quotidien sur sommeil, nutrition, activité et motivation.',
            teamId: kclec.id,
            staffId: staff1.id,
            createdBy: staff1.id,
            status: QuestionnaireStatus.COMPLETED,
            scheduledAt: new Date('2026-04-29T08:00:00.000Z'),
            closesAt: new Date('2026-04-29T12:00:00.000Z'),
            questions: {
                create: [
                    {
                        title: 'Comment te sens-tu aujourd’hui ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 1,
                    },
                    {
                        title: 'Combien d’heures as-tu dormi ?',
                        type: QuestionType.NUMBER,
                        options: [],
                        order: 2,
                    },
                    {
                        title: 'Combien de repas complets as-tu pris hier ?',
                        type: QuestionType.NUMBER,
                        options: [],
                        order: 3,
                    },
                    {
                        title: 'Quel type de repas a dominé ta journée ?',
                        type: QuestionType.SINGLE_CHOICE,
                        options: ['Équilibré', 'Riche en glucides', 'Protéiné', 'Fast food', 'Sauté'],
                        order: 4,
                    },
                    {
                        title: 'As-tu fait du sport hors entraînement ?',
                        type: QuestionType.BOOLEAN,
                        options: ['Oui', 'Non'],
                        order: 5,
                    },
                    {
                        title: 'Quel est ton ressenti physique ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 6,
                    },
                    {
                        title: 'Quel est ton niveau de motivation ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 7,
                    },
                ],
            },
        },
        include: { questions: true },
    });

    const postMatchQuestionnaire = await prisma.questionnaire.create({
        data: {
            title: 'KC LEC - Après match vs Team Vitality',
            description: 'Retour individuel après match : préparation, charge, confiance et ressenti.',
            teamId: kclec.id,
            staffId: staff1.id,
            createdBy: staff1.id,
            status: QuestionnaireStatus.COMPLETED,
            eventId: calendarEvents[1]!.id,
            scheduledAt: new Date('2026-04-29T21:15:00.000Z'),
            closesAt: new Date('2026-04-30T11:00:00.000Z'),
            questions: {
                create: [
                    {
                        title: 'Comment te sens-tu après le match ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 1,
                    },
                    {
                        title: 'As-tu joué au jeu avant le match ?',
                        type: QuestionType.BOOLEAN,
                        options: ['Oui', 'Non'],
                        order: 2,
                    },
                    {
                        title: 'Si oui, combien de parties as-tu jouées avant le match ?',
                        type: QuestionType.NUMBER,
                        options: [],
                        order: 3,
                    },
                    {
                        title: 'Quel est ton ressenti physique après le match ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 4,
                    },
                    {
                        title: 'Quel est ton niveau de motivation après le match ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 5,
                    },
                    {
                        title: 'Note libre sur ton match',
                        type: QuestionType.TEXT,
                        options: [],
                        isRequired: false,
                        order: 6,
                    },
                ],
            },
        },
        include: { questions: true },
    });

    const fnaticPostMatchQuestionnaire = await prisma.questionnaire.create({
        data: {
            title: 'KC LEC - Après match vs Fnatic',
            description: 'Questionnaire clôturé lié au match officiel contre Fnatic.',
            teamId: kclec.id,
            staffId: staff1.id,
            createdBy: staff1.id,
            status: QuestionnaireStatus.COMPLETED,
            eventId: calendarEvents[3]!.id,
            scheduledAt: new Date('2026-05-02T20:45:00.000Z'),
            closesAt: new Date('2026-05-03T11:00:00.000Z'),
            questions: {
                create: [
                    {
                        title: 'Comment te sens-tu après le match ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 1,
                    },
                    {
                        title: 'Quel est ton niveau de motivation après le match ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 2,
                    },
                    {
                        title: 'Combien de parties as-tu jouées avant le match ?',
                        type: QuestionType.NUMBER,
                        options: [],
                        order: 3,
                    },
                ],
            },
        },
        include: { questions: true },
    });

    const futureDailyQuestionnaire = await prisma.questionnaire.create({
        data: {
            title: 'KC LEC - Daily wellness avant scrim G2',
            description: 'Questionnaire actif à venir : ses métriques restent masquées jusqu’à la clôture.',
            teamId: kclec.id,
            staffId: staff1.id,
            createdBy: staff1.id,
            status: QuestionnaireStatus.ACTIVE,
            eventId: calendarEvents[4]!.id,
            scheduledAt: new Date('2026-05-22T08:00:00.000Z'),
            closesAt: new Date('2026-05-22T12:00:00.000Z'),
            questions: {
                create: [
                    {
                        title: 'Comment te sens-tu aujourd’hui ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 1,
                    },
                    {
                        title: 'Combien d’heures as-tu dormi ?',
                        type: QuestionType.NUMBER,
                        options: [],
                        order: 2,
                    },
                    {
                        title: 'Quel est ton niveau de motivation ?',
                        type: QuestionType.SCALE,
                        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                        order: 3,
                    },
                ],
            },
        },
        include: { questions: true },
    });

    const dailyAnswersByNick: Record<string, Record<string, string>> = {
        Canna: {
            feel: '7',
            sleep: '7.2',
            meals: '3',
            mealType: 'Équilibré',
            sport: 'Oui',
            physical: '7',
            motivation: '8',
        },
        Yike: {
            feel: '8',
            sleep: '8.1',
            meals: '4',
            mealType: 'Protéiné',
            sport: 'Oui',
            physical: '8',
            motivation: '9',
        },
        Kyeahoo: {
            feel: '6',
            sleep: '6.4',
            meals: '3',
            mealType: 'Riche en glucides',
            sport: 'Non',
            physical: '6',
            motivation: '7',
        },
        Caliste: {
            feel: '9',
            sleep: '8.5',
            meals: '4',
            mealType: 'Équilibré',
            sport: 'Oui',
            physical: '9',
            motivation: '10',
        },
        Busio: {
            feel: '7',
            sleep: '7.6',
            meals: '3',
            mealType: 'Équilibré',
            sport: 'Non',
            physical: '7',
            motivation: '8',
        },
    };

    const postMatchAnswersByNick: Record<string, Record<string, string>> = {
        Canna: {
            feel: '7',
            playedBefore: 'Oui',
            gamesBefore: '2',
            physical: '6',
            motivation: '8',
            note: 'Bonne gestion de la lane, énergie stable en late game.',
        },
        Yike: {
            feel: '8',
            playedBefore: 'Oui',
            gamesBefore: '3',
            physical: '7',
            motivation: '9',
            note: 'Très bon tempo jungle et communication claire sur les objectifs.',
        },
        Kyeahoo: {
            feel: '6',
            playedBefore: 'Oui',
            gamesBefore: '1',
            physical: '6',
            motivation: '7',
            note: 'Quelques hésitations sur les timings de roam, bonne adaptation.',
        },
        Caliste: {
            feel: '9',
            playedBefore: 'Oui',
            gamesBefore: '2',
            physical: '8',
            motivation: '10',
            note: 'Très fort impact mécanique, demande à garder la routine actuelle.',
        },
        Busio: {
            feel: '7',
            playedBefore: 'Non',
            gamesBefore: '0',
            physical: '7',
            motivation: '8',
            note: 'Shotcalls propres, bonne stabilité sous pression.',
        },
    };

    const dailyQuestionKeys = ['feel', 'sleep', 'meals', 'mealType', 'sport', 'physical', 'motivation'];
    const postMatchQuestionKeys = ['feel', 'playedBefore', 'gamesBefore', 'physical', 'motivation', 'note'];

    for (const player of kcLecPlayers) {
        const nickName = player.nickName ?? player.firstName;
        const dailyAnswers = dailyAnswersByNick[nickName];
        const postMatchAnswers = postMatchAnswersByNick[nickName];

        if (!dailyAnswers || !postMatchAnswers) {
            throw new Error(`Réponses KC LEC manquantes pour ${nickName}`);
        }

        for (const [index, key] of dailyQuestionKeys.entries()) {
            const question = dailyQuestionnaire.questions[index];
            const value = dailyAnswers[key];
            if (!question || value === undefined) {
                throw new Error(`Réponse daily invalide pour ${nickName} (${key})`);
            }
            await prisma.answer.create({
                data: {
                    playerId: player.id,
                    questionId: question.id,
                    value,
                    submittedAt: new Date('2026-04-29T09:30:00.000Z'),
                },
            });
        }

        for (const [index, key] of postMatchQuestionKeys.entries()) {
            const question = postMatchQuestionnaire.questions[index];
            const value = postMatchAnswers[key];
            if (!question || value === undefined) {
                throw new Error(`Réponse post-match invalide pour ${nickName} (${key})`);
            }
            await prisma.answer.create({
                data: {
                    playerId: player.id,
                    questionId: question.id,
                    value,
                    submittedAt: new Date('2026-04-29T22:10:00.000Z'),
                },
            });
        }

        const fnaticValues = [
            String(Math.min(10, Number(postMatchAnswers['feel']) + 1)),
            String(Math.min(10, Number(postMatchAnswers['motivation']) + 1)),
            postMatchAnswers['gamesBefore'],
        ];
        for (const [index, value] of fnaticValues.entries()) {
            const question = fnaticPostMatchQuestionnaire.questions[index];
            if (!question || value === undefined) {
                throw new Error(`Réponse Fnatic invalide pour ${nickName}`);
            }
            await prisma.answer.create({
                data: {
                    playerId: player.id,
                    questionId: question.id,
                    value,
                    submittedAt: new Date('2026-05-02T21:30:00.000Z'),
                },
            });
        }

        const futureDailyValues = [
            String(Math.max(1, Number(dailyAnswers['feel']) - 1)),
            String(Math.max(4, Number(dailyAnswers['sleep']) - 0.4)),
            String(Math.max(1, Number(dailyAnswers['motivation']) - 1)),
        ];
        for (const [index, value] of futureDailyValues.entries()) {
            const question = futureDailyQuestionnaire.questions[index];
            if (!question || value === undefined) {
                throw new Error(`Réponse future daily invalide pour ${nickName}`);
            }
            await prisma.answer.create({
                data: {
                    playerId: player.id,
                    questionId: question.id,
                    value,
                    submittedAt: new Date('2026-05-22T09:30:00.000Z'),
                },
            });
        }

        const matchRating = Number(postMatchAnswers['physical']) + Number(postMatchAnswers['motivation']) / 10;
        await prisma.matchPlayerNote.create({
            data: {
                eventId: calendarEvents[1]!.id,
                playerId: player.id,
                staffId: staff1.id,
                rating: Number(matchRating.toFixed(1)),
                comment: postMatchAnswers['note'],
            },
        });

        const metrics = [
            {
                type: 'WELLNESS_SCORE',
                value: Number(dailyAnswers['feel']),
                unit: '/10',
                capturedAt: '2026-04-29T09:30:00.000Z',
                questionnaireId: dailyQuestionnaire.id,
            },
            {
                type: 'SLEEP_HOURS',
                value: Number(dailyAnswers['sleep']),
                unit: 'h',
                capturedAt: '2026-04-29T09:30:00.000Z',
                questionnaireId: dailyQuestionnaire.id,
            },
            {
                type: 'MEALS_COUNT',
                value: Number(dailyAnswers['meals']),
                unit: 'repas',
                capturedAt: '2026-04-29T09:30:00.000Z',
                questionnaireId: dailyQuestionnaire.id,
            },
            {
                type: 'PHYSICAL_FEELING',
                value: Number(dailyAnswers['physical']),
                unit: '/10',
                capturedAt: '2026-04-29T09:30:00.000Z',
                questionnaireId: dailyQuestionnaire.id,
            },
            {
                type: 'MOTIVATION',
                value: Number(dailyAnswers['motivation']),
                unit: '/10',
                capturedAt: '2026-04-29T09:30:00.000Z',
                questionnaireId: dailyQuestionnaire.id,
            },
            {
                type: 'PRE_MATCH_GAMES',
                value: Number(postMatchAnswers['gamesBefore']),
                unit: 'games',
                capturedAt: '2026-04-29T22:10:00.000Z',
                questionnaireId: postMatchQuestionnaire.id,
            },
            {
                type: 'POST_MATCH_FEELING',
                value: Number(postMatchAnswers['feel']),
                unit: '/10',
                capturedAt: '2026-04-29T22:10:00.000Z',
                questionnaireId: postMatchQuestionnaire.id,
            },
            {
                type: 'MATCH_RATING',
                value: Number(matchRating.toFixed(1)),
                unit: '/10',
                capturedAt: '2026-04-29T22:30:00.000Z',
                questionnaireId: null,
            },
            {
                type: 'POST_MATCH_FEELING',
                value: Number(fnaticValues[0]),
                unit: '/10',
                capturedAt: '2026-05-02T21:30:00.000Z',
                questionnaireId: fnaticPostMatchQuestionnaire.id,
            },
            {
                type: 'MOTIVATION',
                value: Number(fnaticValues[1]),
                unit: '/10',
                capturedAt: '2026-05-02T21:30:00.000Z',
                questionnaireId: fnaticPostMatchQuestionnaire.id,
            },
            {
                type: 'PRE_MATCH_GAMES',
                value: Number(fnaticValues[2]),
                unit: 'games',
                capturedAt: '2026-05-02T21:30:00.000Z',
                questionnaireId: fnaticPostMatchQuestionnaire.id,
            },
            {
                type: 'WELLNESS_SCORE',
                value: Number(futureDailyValues[0]),
                unit: '/10',
                capturedAt: '2026-05-22T09:30:00.000Z',
                questionnaireId: futureDailyQuestionnaire.id,
            },
            {
                type: 'SLEEP_HOURS',
                value: Number(futureDailyValues[1]),
                unit: 'h',
                capturedAt: '2026-05-22T09:30:00.000Z',
                questionnaireId: futureDailyQuestionnaire.id,
            },
            {
                type: 'MOTIVATION',
                value: Number(futureDailyValues[2]),
                unit: '/10',
                capturedAt: '2026-05-22T09:30:00.000Z',
                questionnaireId: futureDailyQuestionnaire.id,
            },
        ];

        await prisma.metric.createMany({
            data: metrics.map((metric) => ({
                playerId: player.id,
                type: metric.type,
                value: metric.value,
                unit: metric.unit,
                capturedAt: new Date(metric.capturedAt),
                questionnaireId: metric.questionnaireId,
            })),
        });
    }

    console.log('✅ Calendrier, questionnaires KC LEC, réponses et métriques créés');

    console.log('🎉 Seeding terminé avec succès !');
    console.log('\n📊 Données créées :');
    console.log(`- ${await prisma.sport.count()} sports`);
    console.log(`- ${await prisma.position.count()} positions`);
    console.log(`- ${await prisma.club.count()} clubs`);
    console.log(`- ${await prisma.user.count()} utilisateurs`);
    console.log(`- ${await prisma.player.count()} joueurs`);
    console.log(`- ${await prisma.calendarEvent.count()} événements calendrier`);
    console.log(`- ${await prisma.questionnaire.count()} questionnaires`);
    console.log(`- ${await prisma.answer.count()} réponses`);
    console.log(`- ${await prisma.metric.count()} métriques`);

    console.log('\n🔐 Comptes de test :');
    console.log('- Staff Karmine Corp :');
    console.log('  Email:', staff1User.email);
    console.log('  Mot de passe: coach123');
    console.log('- Staff Team Vitality :');
    console.log('  Email:', staff2User.email);
    console.log('  Mot de passe: coach123');
    console.log('- Joueurs :');
    console.log('  Email: voir dans le code source du seed.ts');
    console.log('  Mot de passe: player123');
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
