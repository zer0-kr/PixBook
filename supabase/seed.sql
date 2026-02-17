-- ============================================================
-- seed.sql — Character data for the reading log application
-- Theme: Height-based everyday objects & landmarks
-- Run this after the initial migration to populate the characters table.
-- ============================================================

INSERT INTO characters (id, name, description, sprite_url, unlock_height_cm, rarity) VALUES

-- COMMON characters (0cm – 850cm)
(gen_random_uuid(), '쌀알', '모든 여정은 한 알의 쌀에서 시작돼요.', '/sprites/characters/rice-grain.png', 0, 'common'),
(gen_random_uuid(), '도토리', '작지만 커다란 나무가 될 씨앗.', '/sprites/characters/acorn.png', 10, 'common'),
(gen_random_uuid(), '병뚜껑', '반짝이는 작은 왕관.', '/sprites/characters/bottle-cap.png', 30, 'common'),
(gen_random_uuid(), '마카롱', '달콤한 독서의 보상.', '/sprites/characters/macaron.png', 50, 'common'),
(gen_random_uuid(), '귤', '겨울 독서의 단짝 친구.', '/sprites/characters/tangerine.png', 70, 'common'),
(gen_random_uuid(), '머그컵', '따뜻한 한 잔과 함께하는 독서.', '/sprites/characters/coffee-mug.png', 100, 'common'),
(gen_random_uuid(), '양초', '은은한 불빛 아래 책 읽기.', '/sprites/characters/candle.png', 120, 'common'),
(gen_random_uuid(), '바나나', '에너지 충전! 한 권 더.', '/sprites/characters/banana.png', 150, 'common'),
(gen_random_uuid(), '우유팩', '지식을 쑥쑥 키우는 우유.', '/sprites/characters/milk-carton.png', 170, 'common'),
(gen_random_uuid(), '운동화', '다음 책을 향해 달려가는 발걸음.', '/sprites/characters/sneaker.png', 200, 'common'),
(gen_random_uuid(), '고양이', '무릎 위에서 함께 읽는 친구.', '/sprites/characters/sitting-cat.png', 220, 'common'),
(gen_random_uuid(), '꽃다발', '독서 250cm 달성 축하!', '/sprites/characters/bouquet.png', 250, 'common'),
(gen_random_uuid(), '곰인형', '포근한 독서 메이트.', '/sprites/characters/teddy-bear.png', 280, 'common'),
(gen_random_uuid(), '선인장', '꾸준히 자라는 독서 습관.', '/sprites/characters/cactus.png', 300, 'common'),
(gen_random_uuid(), '소화기', '불타는 독서 열정을 진화하지 마세요!', '/sprites/characters/fire-extinguisher.png', 330, 'common'),
(gen_random_uuid(), '우쿨렐레', '책 속의 작은 세레나데.', '/sprites/characters/ukulele.png', 360, 'common'),
(gen_random_uuid(), '강아지', '충실한 독서견이 응원해요.', '/sprites/characters/puppy.png', 390, 'common'),
(gen_random_uuid(), '지구본', '책으로 세계를 탐험.', '/sprites/characters/globe.png', 420, 'common'),
(gen_random_uuid(), '기타', '이야기가 만드는 멜로디.', '/sprites/characters/guitar.png', 450, 'common'),
(gen_random_uuid(), '우산', '비 오는 날 최고의 독서.', '/sprites/characters/umbrella.png', 480, 'common'),
(gen_random_uuid(), '망원경', '더 넓은 세계를 바라보는 눈.', '/sprites/characters/telescope.png', 510, 'common'),
(gen_random_uuid(), '자전거', '다음 이야기로 페달을 밟아요.', '/sprites/characters/bicycle.png', 540, 'common'),
(gen_random_uuid(), '황제펭귄', '남극에서 온 독서 친구.', '/sprites/characters/emperor-penguin.png', 570, 'common'),
(gen_random_uuid(), '스노보드', '이야기의 슬로프를 질주!', '/sprites/characters/snowboard.png', 600, 'common'),
(gen_random_uuid(), '사람', '드디어 나만큼 자란 탑!', '/sprites/characters/person.png', 640, 'common'),
(gen_random_uuid(), '냉장고', '지식으로 꽉 찬 냉장고.', '/sprites/characters/refrigerator.png', 680, 'common'),
(gen_random_uuid(), '문', '새로운 세계로 열리는 문.', '/sprites/characters/door.png', 720, 'common'),
(gen_random_uuid(), '피아노', '독서의 하모니가 울려 퍼져요.', '/sprites/characters/piano.png', 760, 'common'),
(gen_random_uuid(), '크리스마스트리', '반짝이는 성과로 장식된 나무.', '/sprites/characters/christmas-tree.png', 800, 'common'),
(gen_random_uuid(), '농구골대', '슛! 목표를 향해 점프!', '/sprites/characters/basketball-hoop.png', 850, 'common'),

-- RARE characters (900cm – 4500cm)
(gen_random_uuid(), '기린', '높이높이 자라는 독서 타워.', '/sprites/characters/giraffe.png', 900, 'rare'),
(gen_random_uuid(), '가로등', '밤길을 밝히는 지식의 빛.', '/sprites/characters/street-lamp.png', 1000, 'rare'),
(gen_random_uuid(), '코끼리', '코끼리만큼 무거운 지식.', '/sprites/characters/elephant.png', 1100, 'rare'),
(gen_random_uuid(), '공룡', '시간을 초월하는 독서.', '/sprites/characters/t-rex.png', 1200, 'rare'),
(gen_random_uuid(), '스쿨버스', '지식으로 가는 통학 버스.', '/sprites/characters/school-bus.png', 1300, 'rare'),
(gen_random_uuid(), '등대', '바다 위 지식의 길잡이.', '/sprites/characters/lighthouse.png', 1400, 'rare'),
(gen_random_uuid(), '범선', '이야기의 바다를 항해.', '/sprites/characters/sailboat.png', 1500, 'rare'),
(gen_random_uuid(), '열기구', '하늘 높이 떠오르는 상상력.', '/sprites/characters/hot-air-balloon.png', 1600, 'rare'),
(gen_random_uuid(), '풍차', '바람과 함께 도는 이야기.', '/sprites/characters/windmill.png', 1700, 'rare'),
(gen_random_uuid(), '대관람차', '높이 올라 세상을 내려다봐요.', '/sprites/characters/ferris-wheel.png', 1800, 'rare'),
(gen_random_uuid(), '로켓', '지식의 우주로 발사!', '/sprites/characters/rocket.png', 1900, 'rare'),
(gen_random_uuid(), '아파트', '7층 건물 높이 돌파!', '/sprites/characters/apartment.png', 2000, 'rare'),
(gen_random_uuid(), '야자수', '열대의 높이에 도달.', '/sprites/characters/palm-tree.png', 2200, 'rare'),
(gen_random_uuid(), '해적선', '보물을 찾아 모험의 바다로.', '/sprites/characters/pirate-ship.png', 2400, 'rare'),
(gen_random_uuid(), '성', '지식의 왕국을 세웠어요.', '/sprites/characters/castle.png', 2600, 'rare'),
(gen_random_uuid(), '대왕고래', '바다에서 가장 큰 친구.', '/sprites/characters/blue-whale.png', 2800, 'rare'),
(gen_random_uuid(), '스핑크스', '고대 지혜의 수호자.', '/sprites/characters/sphinx.png', 3000, 'rare'),
(gen_random_uuid(), '탑', '지식이 겹겹이 쌓인 탑.', '/sprites/characters/pagoda.png', 3500, 'rare'),
(gen_random_uuid(), '석유시추선', '깊은 지식을 시추 중.', '/sprites/characters/oil-platform.png', 4000, 'rare'),
(gen_random_uuid(), '개선문', '독서의 승리를 기념하며.', '/sprites/characters/arc-de-triomphe.png', 4500, 'rare'),

-- EPIC characters (5000cm – 9000cm)
(gen_random_uuid(), '피사의 사탑', '기울어도 무너지지 않는 독서탑.', '/sprites/characters/leaning-tower.png', 5000, 'epic'),
(gen_random_uuid(), '나이아가라 폭포', '쏟아지는 지식의 폭포.', '/sprites/characters/niagara-falls.png', 5500, 'epic'),
(gen_random_uuid(), '타지마할', '아름다운 지식의 궁전.', '/sprites/characters/taj-mahal.png', 6000, 'epic'),
(gen_random_uuid(), '빅벤', '시간이 말해주는 이야기.', '/sprites/characters/big-ben.png', 6500, 'epic'),
(gen_random_uuid(), '자유의 여신상', '지식의 횃불을 높이 들고.', '/sprites/characters/statue-of-liberty.png', 7000, 'epic'),
(gen_random_uuid(), '피라미드', '수천 년의 지식이 쌓인 곳.', '/sprites/characters/pyramid.png', 7500, 'epic'),
(gen_random_uuid(), '우주왕복선', '대기권 밖으로 날아올라.', '/sprites/characters/space-shuttle.png', 8000, 'epic'),
(gen_random_uuid(), '에펠탑', '파리의 별을 향해!', '/sprites/characters/eiffel-tower.png', 9000, 'epic'),

-- LEGENDARY characters (10000cm+)
(gen_random_uuid(), '도쿄타워', '100미터, 도시를 내려다보며.', '/sprites/characters/tokyo-tower.png', 10000, 'legendary'),
(gen_random_uuid(), 'N서울타워', '남산타워만큼 쌓은 책의 탑!', '/sprites/characters/namsan-tower.png', 33300, 'legendary'),
(gen_random_uuid(), '롯데월드타워', '대한민국 최고봉의 독서가.', '/sprites/characters/lotte-tower.png', 55500, 'legendary'),
(gen_random_uuid(), '구름 위 성', '1km — 구름 위의 독서 왕국.', '/sprites/characters/cloud-castle.png', 100000, 'legendary');
