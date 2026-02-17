-- ============================================================
-- 00006_character_redesign.sql
-- 캐릭터 재설계: 판타지 크리처 → 높이 기반 일상 사물/랜드마크
-- unlock_height_cm + rarity 복합키로 매칭하여 UPDATE
-- character.id 유지 → user_characters FK 관계 보존
-- ============================================================

-- COMMON (30)
UPDATE characters SET name='쌀알', description='모든 여정은 한 알의 쌀에서 시작돼요.', sprite_url='/sprites/characters/rice-grain.png' WHERE unlock_height_cm=0 AND rarity='common';
UPDATE characters SET name='도토리', description='작지만 커다란 나무가 될 씨앗.', sprite_url='/sprites/characters/acorn.png' WHERE unlock_height_cm=10 AND rarity='common';
UPDATE characters SET name='병뚜껑', description='반짝이는 작은 왕관.', sprite_url='/sprites/characters/bottle-cap.png' WHERE unlock_height_cm=30 AND rarity='common';
UPDATE characters SET name='마카롱', description='달콤한 독서의 보상.', sprite_url='/sprites/characters/macaron.png' WHERE unlock_height_cm=50 AND rarity='common';
UPDATE characters SET name='귤', description='겨울 독서의 단짝 친구.', sprite_url='/sprites/characters/tangerine.png' WHERE unlock_height_cm=70 AND rarity='common';
UPDATE characters SET name='머그컵', description='따뜻한 한 잔과 함께하는 독서.', sprite_url='/sprites/characters/coffee-mug.png' WHERE unlock_height_cm=100 AND rarity='common';
UPDATE characters SET name='양초', description='은은한 불빛 아래 책 읽기.', sprite_url='/sprites/characters/candle.png' WHERE unlock_height_cm=120 AND rarity='common';
UPDATE characters SET name='바나나', description='에너지 충전! 한 권 더.', sprite_url='/sprites/characters/banana.png' WHERE unlock_height_cm=150 AND rarity='common';
UPDATE characters SET name='우유팩', description='지식을 쑥쑥 키우는 우유.', sprite_url='/sprites/characters/milk-carton.png' WHERE unlock_height_cm=170 AND rarity='common';
UPDATE characters SET name='운동화', description='다음 책을 향해 달려가는 발걸음.', sprite_url='/sprites/characters/sneaker.png' WHERE unlock_height_cm=200 AND rarity='common';
UPDATE characters SET name='고양이', description='무릎 위에서 함께 읽는 친구.', sprite_url='/sprites/characters/sitting-cat.png' WHERE unlock_height_cm=220 AND rarity='common';
UPDATE characters SET name='꽃다발', description='독서 250cm 달성 축하!', sprite_url='/sprites/characters/bouquet.png' WHERE unlock_height_cm=250 AND rarity='common';
UPDATE characters SET name='곰인형', description='포근한 독서 메이트.', sprite_url='/sprites/characters/teddy-bear.png' WHERE unlock_height_cm=280 AND rarity='common';
UPDATE characters SET name='선인장', description='꾸준히 자라는 독서 습관.', sprite_url='/sprites/characters/cactus.png' WHERE unlock_height_cm=300 AND rarity='common';
UPDATE characters SET name='소화기', description='불타는 독서 열정을 진화하지 마세요!', sprite_url='/sprites/characters/fire-extinguisher.png' WHERE unlock_height_cm=330 AND rarity='common';
UPDATE characters SET name='우쿨렐레', description='책 속의 작은 세레나데.', sprite_url='/sprites/characters/ukulele.png' WHERE unlock_height_cm=360 AND rarity='common';
UPDATE characters SET name='강아지', description='충실한 독서견이 응원해요.', sprite_url='/sprites/characters/puppy.png' WHERE unlock_height_cm=390 AND rarity='common';
UPDATE characters SET name='지구본', description='책으로 세계를 탐험.', sprite_url='/sprites/characters/globe.png' WHERE unlock_height_cm=420 AND rarity='common';
UPDATE characters SET name='기타', description='이야기가 만드는 멜로디.', sprite_url='/sprites/characters/guitar.png' WHERE unlock_height_cm=450 AND rarity='common';
UPDATE characters SET name='우산', description='비 오는 날 최고의 독서.', sprite_url='/sprites/characters/umbrella.png' WHERE unlock_height_cm=480 AND rarity='common';
UPDATE characters SET name='망원경', description='더 넓은 세계를 바라보는 눈.', sprite_url='/sprites/characters/telescope.png' WHERE unlock_height_cm=510 AND rarity='common';
UPDATE characters SET name='자전거', description='다음 이야기로 페달을 밟아요.', sprite_url='/sprites/characters/bicycle.png' WHERE unlock_height_cm=540 AND rarity='common';
UPDATE characters SET name='황제펭귄', description='남극에서 온 독서 친구.', sprite_url='/sprites/characters/emperor-penguin.png' WHERE unlock_height_cm=570 AND rarity='common';
UPDATE characters SET name='스노보드', description='이야기의 슬로프를 질주!', sprite_url='/sprites/characters/snowboard.png' WHERE unlock_height_cm=600 AND rarity='common';
UPDATE characters SET name='사람', description='드디어 나만큼 자란 탑!', sprite_url='/sprites/characters/person.png' WHERE unlock_height_cm=640 AND rarity='common';
UPDATE characters SET name='냉장고', description='지식으로 꽉 찬 냉장고.', sprite_url='/sprites/characters/refrigerator.png' WHERE unlock_height_cm=680 AND rarity='common';
UPDATE characters SET name='문', description='새로운 세계로 열리는 문.', sprite_url='/sprites/characters/door.png' WHERE unlock_height_cm=720 AND rarity='common';
UPDATE characters SET name='피아노', description='독서의 하모니가 울려 퍼져요.', sprite_url='/sprites/characters/piano.png' WHERE unlock_height_cm=760 AND rarity='common';
UPDATE characters SET name='크리스마스트리', description='반짝이는 성과로 장식된 나무.', sprite_url='/sprites/characters/christmas-tree.png' WHERE unlock_height_cm=800 AND rarity='common';
UPDATE characters SET name='농구골대', description='슛! 목표를 향해 점프!', sprite_url='/sprites/characters/basketball-hoop.png' WHERE unlock_height_cm=850 AND rarity='common';

-- RARE (20)
UPDATE characters SET name='기린', description='높이높이 자라는 독서 타워.', sprite_url='/sprites/characters/giraffe.png' WHERE unlock_height_cm=900 AND rarity='rare';
UPDATE characters SET name='가로등', description='밤길을 밝히는 지식의 빛.', sprite_url='/sprites/characters/street-lamp.png' WHERE unlock_height_cm=1000 AND rarity='rare';
UPDATE characters SET name='코끼리', description='코끼리만큼 무거운 지식.', sprite_url='/sprites/characters/elephant.png' WHERE unlock_height_cm=1100 AND rarity='rare';
UPDATE characters SET name='공룡', description='시간을 초월하는 독서.', sprite_url='/sprites/characters/t-rex.png' WHERE unlock_height_cm=1200 AND rarity='rare';
UPDATE characters SET name='스쿨버스', description='지식으로 가는 통학 버스.', sprite_url='/sprites/characters/school-bus.png' WHERE unlock_height_cm=1300 AND rarity='rare';
UPDATE characters SET name='등대', description='바다 위 지식의 길잡이.', sprite_url='/sprites/characters/lighthouse.png' WHERE unlock_height_cm=1400 AND rarity='rare';
UPDATE characters SET name='범선', description='이야기의 바다를 항해.', sprite_url='/sprites/characters/sailboat.png' WHERE unlock_height_cm=1500 AND rarity='rare';
UPDATE characters SET name='열기구', description='하늘 높이 떠오르는 상상력.', sprite_url='/sprites/characters/hot-air-balloon.png' WHERE unlock_height_cm=1600 AND rarity='rare';
UPDATE characters SET name='풍차', description='바람과 함께 도는 이야기.', sprite_url='/sprites/characters/windmill.png' WHERE unlock_height_cm=1700 AND rarity='rare';
UPDATE characters SET name='대관람차', description='높이 올라 세상을 내려다봐요.', sprite_url='/sprites/characters/ferris-wheel.png' WHERE unlock_height_cm=1800 AND rarity='rare';
UPDATE characters SET name='로켓', description='지식의 우주로 발사!', sprite_url='/sprites/characters/rocket.png' WHERE unlock_height_cm=1900 AND rarity='rare';
UPDATE characters SET name='아파트', description='7층 건물 높이 돌파!', sprite_url='/sprites/characters/apartment.png' WHERE unlock_height_cm=2000 AND rarity='rare';
UPDATE characters SET name='야자수', description='열대의 높이에 도달.', sprite_url='/sprites/characters/palm-tree.png' WHERE unlock_height_cm=2200 AND rarity='rare';
UPDATE characters SET name='해적선', description='보물을 찾아 모험의 바다로.', sprite_url='/sprites/characters/pirate-ship.png' WHERE unlock_height_cm=2400 AND rarity='rare';
UPDATE characters SET name='성', description='지식의 왕국을 세웠어요.', sprite_url='/sprites/characters/castle.png' WHERE unlock_height_cm=2600 AND rarity='rare';
UPDATE characters SET name='대왕고래', description='바다에서 가장 큰 친구.', sprite_url='/sprites/characters/blue-whale.png' WHERE unlock_height_cm=2800 AND rarity='rare';
UPDATE characters SET name='스핑크스', description='고대 지혜의 수호자.', sprite_url='/sprites/characters/sphinx.png' WHERE unlock_height_cm=3000 AND rarity='rare';
UPDATE characters SET name='탑', description='지식이 겹겹이 쌓인 탑.', sprite_url='/sprites/characters/pagoda.png' WHERE unlock_height_cm=3500 AND rarity='rare';
UPDATE characters SET name='석유시추선', description='깊은 지식을 시추 중.', sprite_url='/sprites/characters/oil-platform.png' WHERE unlock_height_cm=4000 AND rarity='rare';
UPDATE characters SET name='개선문', description='독서의 승리를 기념하며.', sprite_url='/sprites/characters/arc-de-triomphe.png' WHERE unlock_height_cm=4500 AND rarity='rare';

-- EPIC (8)
UPDATE characters SET name='피사의 사탑', description='기울어도 무너지지 않는 독서탑.', sprite_url='/sprites/characters/leaning-tower.png' WHERE unlock_height_cm=5000 AND rarity='epic';
UPDATE characters SET name='나이아가라 폭포', description='쏟아지는 지식의 폭포.', sprite_url='/sprites/characters/niagara-falls.png' WHERE unlock_height_cm=5500 AND rarity='epic';
UPDATE characters SET name='타지마할', description='아름다운 지식의 궁전.', sprite_url='/sprites/characters/taj-mahal.png' WHERE unlock_height_cm=6000 AND rarity='epic';
UPDATE characters SET name='빅벤', description='시간이 말해주는 이야기.', sprite_url='/sprites/characters/big-ben.png' WHERE unlock_height_cm=6500 AND rarity='epic';
UPDATE characters SET name='자유의 여신상', description='지식의 횃불을 높이 들고.', sprite_url='/sprites/characters/statue-of-liberty.png' WHERE unlock_height_cm=7000 AND rarity='epic';
UPDATE characters SET name='피라미드', description='수천 년의 지식이 쌓인 곳.', sprite_url='/sprites/characters/pyramid.png' WHERE unlock_height_cm=7500 AND rarity='epic';
UPDATE characters SET name='우주왕복선', description='대기권 밖으로 날아올라.', sprite_url='/sprites/characters/space-shuttle.png' WHERE unlock_height_cm=8000 AND rarity='epic';
UPDATE characters SET name='에펠탑', description='파리의 별을 향해!', sprite_url='/sprites/characters/eiffel-tower.png' WHERE unlock_height_cm=9000 AND rarity='epic';

-- LEGENDARY (4)
UPDATE characters SET name='도쿄타워', description='100미터, 도시를 내려다보며.', sprite_url='/sprites/characters/tokyo-tower.png' WHERE unlock_height_cm=10000 AND rarity='legendary';
UPDATE characters SET name='N서울타워', description='남산타워만큼 쌓은 책의 탑!', sprite_url='/sprites/characters/namsan-tower.png' WHERE unlock_height_cm=33300 AND rarity='legendary';
UPDATE characters SET name='롯데월드타워', description='대한민국 최고봉의 독서가.', sprite_url='/sprites/characters/lotte-tower.png' WHERE unlock_height_cm=55500 AND rarity='legendary';
UPDATE characters SET name='구름 위 성', description='1km — 구름 위의 독서 왕국.', sprite_url='/sprites/characters/cloud-castle.png' WHERE unlock_height_cm=100000 AND rarity='legendary';
